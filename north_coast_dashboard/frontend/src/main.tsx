/**
 * North Coast Operations demo
 * Local: npm install && npm run dev (port 5175).
 * API: copy .env.example to .env.local; run the sibling Spring Boot backend.
 * Vercel: root = north_coast_dashboard/frontend; Vite; output = dist.
 * Set VITE_API_URL to the deployed API origin, then rebuild. See ../README.md.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  CssBaseline,
  GlobalStyles,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/manrope';
import { theme } from './theme';
import './styles.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);
