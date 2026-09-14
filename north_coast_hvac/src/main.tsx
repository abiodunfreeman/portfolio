/**
 * North Coast Heating & Cooling — demo quick start
 * Local: cd north_coast_hvac && npm install && npm run dev
 * Vercel: import this repo; Root Directory = north_coast_hvac;
 * framework = Vite; build = npm run build; output = dist.
 * Optional: add server-only OPENAI_API_KEY (see .env.example).
 * Bookings/callbacks stay in this browser; no real appointments are dispatched.
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
