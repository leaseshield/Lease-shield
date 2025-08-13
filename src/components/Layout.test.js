import { render, screen } from '@testing-library/react';
import Layout from './Layout';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from '../context/ColorModeContext';
import { HelmetProvider } from 'react-helmet-async';
import '@testing-library/jest-dom';

jest.mock('../hooks/useAuthState', () => ({
  useAuthState: () => ({ user: null, loading: false })
}));

test('newsletter field and social icons are accessible', () => {
  const theme = createTheme({ palette: { gradients: { soft: '#fff' } } });
  render(
    <HelmetProvider>
      <MemoryRouter>
        <ColorModeContext.Provider value={{ toggleColorMode: () => {} }}>
          <ThemeProvider theme={theme}>
            <Layout><div /></Layout>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </MemoryRouter>
    </HelmetProvider>
  );
  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/facebook/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/twitter/i)).toBeInTheDocument();
});
