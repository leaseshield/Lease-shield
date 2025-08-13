import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { UploadFile as UploadFileIcon, Description as DescriptionIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuthState } from '../hooks/useAuthState';
import { getApiBaseUrl } from '../utils/api';

const ComplianceTemplateManager = () => {
  const { user } = useAuthState();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = getApiBaseUrl();

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${apiUrl}/api/compliance/template`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 404) {
          setTemplate(null);
        } else if (!response.ok) {
          throw new Error('Failed to fetch template status.');
        } else {
          const data = await response.json();
          setTemplate({ name: data.fileName });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [user, apiUrl]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append('templateFile', file);

      const response = await fetch(`${apiUrl}/api/compliance/template`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Upload failed.');
      }
      const data = await response.json();
      setTemplate(data.template);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${apiUrl}/api/compliance/template`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Deletion failed.');
      }
      setTemplate(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Master Lease Template" />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : template ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon sx={{ mr: 2 }} color="primary" />
              <Typography variant="body1">{template.name}</Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No master template has been uploaded.
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              disabled={loading}
            >
              Upload Template
              <input type="file" hidden accept=".pdf,.txt,.docx" onChange={handleUpload} />
            </Button>
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </CardContent>
    </Card>
  );
};

export default ComplianceTemplateManager;
