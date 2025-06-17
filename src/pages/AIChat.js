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
        body: JSON.stringify({ message: userText }),
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
  );
};

export default AIChat; 