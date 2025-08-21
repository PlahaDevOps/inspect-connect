import {createTheme } from '@mui/material/styles';

export const themeProvider = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: '#1A2C47',
    },
    secondary: {
      main: '#F5F5F0',
    }
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});