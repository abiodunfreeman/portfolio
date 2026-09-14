import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#123653' },
    secondary: { main: '#c74b13', contrastText: '#fff' },
    background: { default: '#fff', paper: '#fff' },
    text: { primary: '#102b46', secondary: '#536678' },
  },
  typography: {
    fontFamily: '"DM Sans Variable", sans-serif',
    button: { textTransform: 'none', fontWeight: 700, fontSize: '0.9375rem' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { padding: '13px 23px', borderRadius: 8 } },
    },
    MuiTextField: { defaultProps: { fullWidth: true, variant: 'outlined' } },
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0 },
      styleOverrides: {
        root: {
          borderBottom: '1px solid #dce4e9',
          background: 'transparent',
          '&::before': { display: 'none' },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { padding: '6px 0', minHeight: 72 },
        content: { fontWeight: 600, fontSize: '1rem' },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: { padding: '0 0 24px', color: '#536678', lineHeight: 1.8 },
      },
    },
  },
});
