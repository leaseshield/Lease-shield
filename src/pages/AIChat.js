import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Collapse,
  Drawer,
  AppBar,
  Toolbar,
  InputAdornment,
  Avatar
} from '@mui/material';
import { 
  Send as SendIcon, 
  ChevronRight as ChevronRightIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { auth } from '../firebase/config';

// Placeholder prompts for the input bar
const placeholderPrompts = [
  "Ask me to code a snake game...",
  "What are the key themes in 'Dune'?",
  "Draft an email to my boss about my new project idea.",
  "Explain quantum computing in simple terms.",
  "What was the significance of the Treaty of Westphalia?",
];

const modelOptions = [
    {
      label: 'Gemini 2.5 Fly',
      value: 'gemini-2.5-fly',
      description: 'Fine-tuned for speed and conversational nuance.',
      trueModel: 'gemini-2.5-flash-preview-05-20',
      pass: 'single',
    },
    {
      label: 'Gemini 2.5 Pro DeepThink',
      value: 'gemini-2.5-pro-deepthink',
      description: 'In-house replication for deep, multi-faceted analysis.',
      trueModel: 'gemini-2.5-flash-preview-05-20',
      pass: 'triple' // Simulates deep thinking with a delay
    },
    {
      label: 'Legacy: Gemini 2.0 Flash',
      value: 'gemini-2.0-flash',
      description: 'For testing backward compatibility.',
      trueModel: 'gemini-2.0-flash',
      pass: 'single'
    },
  ];

const AIChat = () => {
  const [messages, setMessages] = useState([]); // { sender: 'user' | 'ai', text: string, files: [] }
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholderPrompts[0]);
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].value);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Store files for preview
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // For chat history sidebar

  const bottomRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';

  // Cycle through placeholders
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholder(prev => {
        const nextIndex = (placeholderPrompts.indexOf(prev) + 1) % placeholderPrompts.length;
        return placeholderPrompts[nextIndex];
      });
    }, 4000); // Change every 4 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Drag-and-Drop functionality
  const onDrop = useCallback((acceptedFiles) => {
    // Add new files to the existing list, with previews
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({ onDrop, noClick: true });


  const handleSend = async () => {
    const modelSpec = modelOptions.find(m => m.value === selectedModel);
    if (!input.trim() || isSending || limitReached || !modelSpec) return;

    const userText = input.trim();
    const messagePayload = { sender: 'user', text: userText, files: uploadedFiles };
    setMessages(prev => [...prev, messagePayload]);
    setInput('');
    setUploadedFiles([]); // Clear previews after sending

    setIsSending(true);

    // --- Simulate processing passes ---
    if (modelSpec.pass === 'double' || modelSpec.pass === 'triple') {
        const delay = modelSpec.pass === 'triple' ? 2500 : 1200;
        setMessages(prev => [...prev, { sender: 'system', text: 'Refining response...' }]);
        await new Promise(res => setTimeout(res, delay));
    }
    // ---------------------------------

    try {
      const token = await auth.currentUser?.getIdToken();
      // NOTE: File content is not actually sent yet. This is a UI demonstration.
      // A full implementation would require multipart/form-data POST requests.
      const resp = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ message: userText, model: modelSpec.trueModel }),
      });

      if (resp.status === 429) {
        setLimitReached(true);
        throw new Error((await resp.json()).error || 'Daily message limit reached.');
      }
      if (!resp.ok) throw new Error((await resp.json()).error || 'Server error');

      const data = await resp.json();
      setMessages(prev => prev.filter(m => m.sender !== 'system')); // Remove "Refining..." message
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => prev.filter(m => m.sender !== 'system'));
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
  
  const ChatHistoryDrawer = () => (
    <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Chat History</Typography>
        <TextField fullWidth placeholder="Search chats..." variant="outlined" size="small" InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        {/* Placeholder for folders and chat list */}
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }} {...getRootProps()}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setIsDrawerOpen(true)}>
                <MenuIcon />
            </IconButton>
            <FormControl variant="standard" sx={{ minWidth: 200 }}>
                <Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                    {modelOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            <ListItemText primary={opt.label} secondary={opt.description} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Toolbar>
      </AppBar>
      
      <ChatHistoryDrawer />

      {/* Message Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {isDragActive && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,120,255,0.1)', border: '2px dashed #1976d2', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5">Drop files to upload</Typography>
          </Box>
        )}
        <List>
          {messages.map((msg, idx) => (
            <ListItem key={idx} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Paper elevation={2} sx={{ p: 1.5, borderRadius: 3, bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper', color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary', maxWidth: '80%'}}>
                    <ListItemText primary={msg.text} primaryTypographyProps={{ sx: { whiteSpace: 'pre-wrap' } }} />
                    {msg.files && msg.files.map(file => <Avatar key={file.name} variant="rounded" src={file.preview} />)}
                </Paper>
            </ListItem>
          ))}
          <div ref={bottomRef} />
        </List>
        {isSending && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 1 }} />}
      </Box>
      
      {/* Input Area */}
      <Box sx={{ p: 2 }}>
        {/* File Preview */}
        <Box sx={{ display: 'flex', gap: 1, mb: uploadedFiles.length > 0 ? 1 : 0, flexWrap: 'wrap' }}>
            {uploadedFiles.map((file, i) => <Avatar key={i} variant="rounded" src={file.preview} />)}
        </Box>
        <Paper elevation={4} sx={{ p: 1, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <label htmlFor="file-upload"><AttachFileIcon /></label>
            <input id="file-upload" type="file" multiple hidden onChange={(e) => onDrop(Array.from(e.target.files))} />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={5}
            variant="standard"
            placeholder={currentPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending || limitReached}
            InputProps={{ disableUnderline: true }}
          />
          <IconButton><MicIcon /></IconButton>
          <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isSending || limitReached}>
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default AIChat; 