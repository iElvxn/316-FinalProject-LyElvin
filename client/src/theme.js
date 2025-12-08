import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1db954',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#282828'
    },
    background: {
      default: '#121212',
      paper: '#181818'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3'
    }
  },
  typography: {
    fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    button: {
      fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      },
    },
  },
});

export default theme;
