import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1817BC',
      light: '#8F9BFF'
    },
  },
  typography: {
    fontFamily: `'Inter', sans-serif`,
    button: {
      textTransform: 'none',
    },
  },
});

export default theme;
