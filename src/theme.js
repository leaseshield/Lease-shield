import { createTheme } from '@mui/material/styles';

const buildTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#6366F1',
      light: '#8B5CF6',
      dark: '#4F46E5',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      aurora: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
    secondary: {
      main: '#10D9C4',
      light: '#4EDDCF',
      dark: '#0BB5A3',
    },
    accent: {
      electric: '#00FF88',
      neon: '#FF006E',
    },
    background: {
      default: mode === 'dark' ? '#0B1020' : '#F8FAFC',
      paper: mode === 'dark' ? '#0F172A' : '#FFFFFF',
      aurora: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 50%, rgba(240, 147, 251, 0.05) 100%)',
    },
    text: {
      primary: mode === 'dark' ? '#E5E7EB' : '#1F2937',
      secondary: mode === 'dark' ? '#94A3B8' : '#4B5563',
    },
    divider: mode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(2,6,23,0.12)',
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      soft: 'linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(240,147,251,0.12) 100%)',
    }
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h1: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.25 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'saturate(180%) blur(12px)',
          backgroundColor: mode === 'dark' ? 'rgba(2,6,23,0.6)' : 'rgba(255,255,255,0.6)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '12px 24px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 18px 36px rgba(0,0,0,0.12)' }
        }
      }
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiContainer: { styleOverrides: { root: { scrollBehavior: 'smooth' } } },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 50%, rgba(240, 147, 251, 0.03) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableHead-root': {
            '& .MuiTableCell-root': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
              fontWeight: 600,
              color: '#6366F1',
              borderBottom: '2px solid rgba(99, 102, 241, 0.2)'
            }
          },
          '& .MuiTableBody-root': {
            '& .MuiTableRow-root': {
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              }
            }
          }
        }
      }
    }
  }
});

export default buildTheme;
