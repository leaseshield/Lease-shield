import React from 'react';

// Simple context to toggle between light and dark modes across the app.
// Consumed in `components/Layout.js` to render a toggle in the header,
// and provided in `App.js` where the MUI theme is created.

export const ColorModeContext = React.createContext({
  mode: 'light',
  toggleColorMode: () => {},
});

