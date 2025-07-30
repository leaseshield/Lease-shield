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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Avatar,
  Slider,
  ListSubheader,
  Tooltip
} from '@mui/material';
import { 
  Send as SendIcon, 
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { auth } from '../firebase/config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- Configuration ---

const placeholderPrompts = [
  "Ask me to code a snake game...",
  "What are the key themes in 'Dune'?",
  "Draft an email to my boss about my new project idea.",
  "Explain quantum computing in simple terms.",
];

const modelGroups = {
  'Generation 3.5': [
    {
      value: 'gemini-2.5-ultra',
      label: '2.5 Ultra',
      description: 'The most powerful model for complex reasoning (coming soon).',
      refinement: true,
      baseModel: 'gemini-2.5-pro',
      available: false, // Coming soon
    },
  ],
  'Generation 3': [
    {
      value: 'gemini-2.5-pro',
      label: '2.5 Pro',
      description: 'Advanced reasoning for demanding tasks (coming soon).',
      refinement: false,
      available: false, // Coming soon
    },
    {
      value: 'gemini-2.5-fly',
      label: '2.5 Fly (Enhanced)',
      description: 'Creative double-pass system for nuanced responses.',
      refinement: true, // This will now trigger the special 3-pass logic
      baseModel: 'gemini-2.5-flash',
      available: true,
    },
  ],
  'Generation 2.5': [
    {
      value: 'gemini-2.5-flash',
      label: '2.5 Flash',
      description: 'Fast and efficient for most tasks.',
      refinement: false,
      available: true,
    },
    {
      value: 'gemini-2.5-flash-lite',
      label: '2.5 Flash Lite',
      description: 'Light & efficient for simple tasks.',
      refinement: false,
      available: true,
    },
  ],
};

const flatModels = Object.values(modelGroups).flat();

const passMarks = [
  { value: 0, label: 'Single' },
  { value: 1, label: 'Double' },
  { value: 2, label: 'Triple' },
  { value: 3, label: 'Max' },
];

// --- Component ---

const AIChat = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholderPrompts[0]);
  const [selectedModel, setSelectedModel] = useState(flatModels[0].value);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const bottomRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';

  // --- Effects ---

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholder(p => placeholderPrompts[(placeholderPrompts.indexOf(p) + 1) % placeholderPrompts.length]);
    }, 4000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Handlers ---

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 5)); // Limit to 5 files
  }, []);

  const { getRootProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  const handleSend = async () => {
    const modelSpec = flatModels.find(m => m.value === selectedModel);

    if (!input.trim() || isSending || limitReached || !modelSpec) return;

    const userText = input.trim();
    const messagePayload = { sender: 'user', text: userText, files: uploadedFiles };
    setMessages(prev => [...prev, messagePayload]);
    setInput('');
    setUploadedFiles([]);

    setIsSending(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      formData.append('message', userText);
      const baseModel = modelSpec.baseModel || modelSpec.value;
      formData.append('model', baseModel);
      formData.append('use_refinement', modelSpec.refinement);
      uploadedFiles.forEach(file => formData.append('files', file));
      
      const resp = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: formData,
      });

      setMessages(prev => prev.filter(m => m.sender !== 'system'));
      if (!resp.ok) {
        throw new Error((await resp.json()).error || 'Server error');
      }

      const data = await resp.json();
      
      // Handle the new 3-pass response for gemini-2.5-fly
      if (modelSpec.value === 'gemini-2.5-fly' && data.final) {
          // Display Pass 1 (Standard)
          setMessages(prev => [...prev, { sender: 'ai', text: '**Pass 1: Standard Response**\n' + data.initial }]);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Display Pass 2 (Creative)
          setMessages(prev => [...prev, { sender: 'ai', text: '**Pass 2: Creative Response**\n' + data.refined }]);
          await new Promise(resolve => setTimeout(resolve, 500));

          // Display Pass 3 (Final Synthesized)
          setMessages(prev => [...prev, { sender: 'ai', text: '**Final Synthesized Response**\n' + data.final }]);

      // Handle standard 2-pass refinement (e.g., for Ultra)
      } else if (modelSpec.refinement && data.initial && data.refined) {
          setMessages(prev => [...prev, { sender: 'ai', text: '**Initial AI Response:**\n' + data.initial }]);
          await new Promise(resolve => setTimeout(resolve, 500));
          setMessages(prev => [...prev, { sender: 'ai', text: '**Refined AI Response:**\n' + data.refined }]);

      // Handle standard single response
      } else {
          setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
      }
    } catch (err) {
      setLimitReached(err.message.includes('limit reached'));
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
  
  // --- Render ---

  return (
    <Box sx={{ p: 2, display: 'flex', height: '100%', flexDirection: 'column' }} {...getRootProps()}>
      
      {/* Top Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel>Model</InputLabel>
          <Select value={selectedModel} label="Model" onChange={(e) => setSelectedModel(e.target.value)}>
            {Object.entries(modelGroups).map(([groupName, models]) => [
              <ListSubheader key={groupName}>{groupName}</ListSubheader>,
              ...models.map(opt => (
                <MenuItem key={opt.value} value={opt.value} disabled={!opt.available}>
                  <ListItemText primary={opt.label} secondary={opt.description} />
                </MenuItem>
              ))
            ])}
          </Select>
        </FormControl>
        {/* Slider removed as passes are implicit in model selection */}
      </Box>

      {/* Message Area */}
      <Paper variant="outlined" sx={{ flexGrow: 1, overflowY: 'auto', p: 2, position: 'relative' }}>
        {isDragActive && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,120,255,0.1)', border: '2px dashed #1976d2', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <Typography variant="h5">Drop Files Here</Typography>
          </Box>
        )}
        <List>
          {messages.map((msg, idx) => (
            <ListItem key={idx} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Paper elevation={msg.sender === 'system' ? 0 : 2} sx={{ p: 1.5, borderRadius: 3, bgcolor: msg.sender === 'user' ? 'primary.main' : (msg.sender === 'system' ? 'transparent' : 'background.paper'), color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary', maxWidth: '80%', textAlign: msg.sender === 'system' ? 'center' : 'left' }}>
                    <ListItemText
                      primary={
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, '')}
                                        style={dark}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    />
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            p: ({ node, ...props }) => <Typography component="span" {...props} />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      }
                    />
                    {msg.files?.map(file => <Avatar key={file.name} variant="rounded" src={file.preview} sx={{mt: 1}}/>)}
                </Paper>
            </ListItem>
          ))}
          <div ref={bottomRef} />
        </List>
        {isSending && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 1 }} />}
      </Paper>
      
      {/* Input Area */}
      <Box sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: uploadedFiles.length > 0 ? 1 : 0, flexWrap: 'wrap' }}>
            {uploadedFiles.map((file, i) => (
              <Tooltip key={i} title={file.name}>
                <Avatar variant="rounded" src={file.preview} />
              </Tooltip>
            ))}
        </Box>
        <Paper elevation={4} sx={{ p: 1, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton component="label">
            <AttachFileIcon />
            <input type="file" multiple hidden onChange={(e) => onDrop(Array.from(e.target.files))} />
          </IconButton>
          <TextField fullWidth multiline maxRows={5} variant="standard" placeholder={currentPlaceholder} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} disabled={isSending || limitReached} InputProps={{ disableUnderline: true }} />
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