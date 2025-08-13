import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

test('renders video with captions', () => {
  const theme = createTheme({ palette: { gradients: { soft: '#fff' } } });
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <Hero onPrimaryClick={() => {}} />
      </ThemeProvider>
    </MemoryRouter>
  );
  const video = screen.getByLabelText(/product demonstration video/i);
  expect(video.querySelector('track')).toBeTruthy();
});
