import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer
} from '@mui/material';
import { CloudUpload, DeleteForever, ReceiptLong } from '@mui/icons-material';
import { auth } from '../firebase/config';

const ExpenseScannerPage = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Dropzone configuration ---
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => {
      const combined = [...prev, ...acceptedFiles];
      // Limit to 5 unique files by name
      const unique = combined.filter((f, i, arr) => arr.findIndex((x) => x.name === f.name) === i);
      return unique.slice(0, 5);
    });
    setErrors([]);
    setResults([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 15 * 1024 * 1024,
  });

  const removeFile = (name) => setFiles((f) => f.filter((file) => file.name !== name));

  // --- Scan handler ---
  const handleScan = async () => {
    if (!files.length) {
      setErrors(['Please add at least one file to scan.']);
      return;
    }
    setLoading(true);
    setErrors([]);
    setResults([]);

    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
      const form = new FormData();
      files.forEach((f) => form.append('documents', f, f.name));
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';
      const res = await fetch(`${apiUrl}/api/scan-expense`, {
        method: 'POST',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Scan failed.');

      setResults(json.extractedDataList || []);
      if (json.errors && json.errors.length) {
        setErrors(json.errors.map((e) => `${e.fileName || 'File'}: ${e.error}`));
      }
    } catch (e) {
      setErrors([e.message]);
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Expense Scanner
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Upload receipts or invoices and let AI extract the key figures for you.
      </Typography>

      {errors.map((err, i) => (
        <Alert severity="error" sx={{ mb: 2 }} key={i}>
          {err}
        </Alert>
      ))}

      <Paper
        variant="outlined"
        sx={{
          p: 4,
          mb: 3,
          textAlign: 'center',
          borderStyle: 'dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          cursor: 'pointer',
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack spacing={1} alignItems="center">
          <CloudUpload fontSize="large" />
          <Typography>
            {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to browse'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PDF, JPG, PNG — max 15&nbsp;MB each
          </Typography>
        </Stack>
      </Paper>

      {files.length > 0 && (
        <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
          {files.map((f) => (
            <Chip
              key={f.name}
              label={f.name}
              onDelete={() => removeFile(f.name)}
              deleteIcon={<DeleteForever />}
            />
          ))}
        </Stack>
      )}

      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ReceiptLong />}
        disabled={loading || !files.length}
        onClick={handleScan}
        sx={{ mb: 4 }}
      >
        {loading ? 'Scanning…' : 'Scan'}
      </Button>

      {results.length > 0 && (
        <Grid container spacing={3}>
          {results.map((r, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    #{idx + 1} – {r.vendor || 'Vendor'}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Date: {r.date || 'N/A'}
                  </Typography>

                  <TableContainer sx={{ maxHeight: 200 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell>Category</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(r.items || []).map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell align="right">${item.amount?.toFixed(2)}</TableCell>
                            <TableCell>{item.category}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box mt={2}>
                    <Typography variant="body2">Subtotal: ${r.subtotal?.toFixed(2)}</Typography>
                    <Typography variant="body2">Tax: ${r.tax?.toFixed(2)}</Typography>
                    <Typography variant="body1" fontWeight={700}>
                      Total: ${r.total?.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ExpenseScannerPage; 