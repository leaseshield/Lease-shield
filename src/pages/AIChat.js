import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { auth } from '../firebase/config';

const AIChat = () => {
  const [messages, setMessages] = useState([]); // { sender: 'user' | 'ai', text: string }
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const bottomRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';

  const modelOptions = [
    {
      label: 'Gemini 2.5 Pro',
      value: 'gemini-2.5-pro',
      speed: '3/5',
      intel: '5/5',
      coding: '5/5',
      multi: 'Input: Text, Code, PDF, Image, Video, Audio <br/> Output: Text, Code',
    },
    {
      label: 'Gemini 2.5 Flash',
      value: 'gemini-2.5-flash',
      speed: '5/5',
      intel: '4/5',
      coding: '4/5',
      multi: 'Input: Text, Code, Image, Video, Audio <br/> Output: Text, Code',
    },
    {
      label: 'Gemini 2.5 Flash-Lite',
      value: 'gemini-2.5-flash-lite-preview-06-17',
      speed: '5/5',
      intel: '3/5',
      coding: '3/5',
      multi: 'Input: Text, Image, Video, Audio <br/> Output: Text',
    },
    {
      label: 'Gemini 2.0 Flash',
      value: 'gemini-2.0-flash',
      speed: '4/5',
      intel: '3/5',
      coding: '3/5',
      multi: 'Input: Text, Code, Image, Video, Audio <br/> Output: Text, Code',
    },
  ];
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].value);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending || limitReached) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsSending(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      const resp = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: userText, model: selectedModel }),
      });

      if (resp.status === 429) {
        const errData = await resp.json();
        setLimitReached(true);
        setMessages(prev => [...prev, { sender: 'system', text: errData.error || 'Daily message limit reached.' }]);
        return;
      }

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || 'Server error');
      }
      const data = await resp.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { sender: 'system', text: `Error: ${err.message}` }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      {/* Header / Container Element */}
      <Box className="MuiBox-root css-86nosg" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" className="MuiTypography-root MuiTypography-h6 css-1anx036" sx={{ flexGrow: 1 }}>
          Lease Shield AI
        </Typography>
        <IconButton className="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-1yxmbwk" disabled>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 2, height: '60vh', overflowY: 'auto' }}>
        <List>
          {messages.map((msg, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={msg.text}
                primaryTypographyProps={{
                  align: msg.sender === 'user' ? 'right' : 'left',
                  sx: { whiteSpace: 'pre-wrap' },
                }}
              />
            </ListItem>
          ))}
          <div ref={bottomRef} />
        </List>
        {isSending && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', mt: 1 }} />}
      </Paper>

      {/* Model selector & input */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            value={selectedModel}
            label="Model"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {modelOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Characteristics table for the selected model */}
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Table size="small">
            <TableBody>
              {['Speed', 'Intelligence', 'Coding Ability', 'Multimodal Capabilities'].map((attr, i) => {
                const opt = modelOptions.find(o => o.value === selectedModel);
                const val = {
                  0: opt.speed,
                  1: opt.intel,
                  2: opt.coding,
                  3: opt.multi,
                }[i];
                return (
                  <TableRow key={attr}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{attr}</TableCell>
                    <TableCell dangerouslySetInnerHTML={{ __html: val }} />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            disabled={limitReached}
            placeholder={limitReached ? 'Daily message limit reached.' : 'Type your message…'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            disabled={isSending || limitReached || !input.trim()}
            onClick={handleSend}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AIChat; 