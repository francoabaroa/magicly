import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  typography: {
    fontFamily: 'Playfair Display, serif',
    button: {
      textTransform: 'none',
      fontFamily: 'Playfair Display, serif',
    }
  },
  palette: {
    primary: {
      main: '#840032',
    },
    secondary: {
      main: '#0A7EF2',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;