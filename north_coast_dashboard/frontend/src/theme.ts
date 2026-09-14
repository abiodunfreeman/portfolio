import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: {
    primary: { main: '#142f48' },
    secondary: { main: '#c55320', contrastText: '#fff' },
    background: { default: '#f5f7fa', paper: '#fff' },
    text: { primary: '#192e43', secondary: '#6a798a' },
  },
  typography: {
    fontFamily: '"DM Sans Variable", sans-serif',
    button: { textTransform: 'none', fontWeight: 650, fontSize: '0.875rem' },
    h1: { fontFamily: '"Manrope Variable", sans-serif' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8, padding: '10px 17px' } },
    },
    MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#edf0f4', fontSize: '0.82rem', padding: '16px' },
        head: {
          background: '#f9fafc',
          color: '#708093',
          fontSize: '0.72rem',
          fontWeight: 650,
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
});
