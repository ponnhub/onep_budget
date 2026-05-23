import { useContext, useMemo, useState, createContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { IntegerToThaiNumber } from 'thainumberconverter';

import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';

// line liff 
import liff from '@line/liff';

// import HTTPService from '../services/httpservice';

// theme
import { createTheme } from '@mui/material/styles';
import { lightGreen, blueGrey, grey } from '@mui/material/colors';
import ThemeProvider, { ColorModeContext } from './theme';

// auth
import { useAuthContext } from "./auth/AuthContext";

// routes
import Router from './routes';

// components
import ScrollToTop from './components/scroll-to-top';
// import { isLocalhost } from '..';

// ----------------------------------------------------------------------
// export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const AppContext = createContext(null);
export const THB = (number) => [new Intl.NumberFormat().format(number), "บาท"].join(" ")

export const NUMBER = (number) => new Intl.NumberFormat().format(number)

export const THAINUMBER = (number) => (new Intl.NumberFormat().format(number)).split(",").map(n => IntegerToThaiNumber(n)).join(",") 
export const THAINUMBER_NO_SEPARATOR = (number) => IntegerToThaiNumber(number)
export const isNumeric = (str) => {
  if (typeof str !== "string") return false // we only process strings!  
  return !Number.isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !Number.isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
export const MaxPageEvents = 25
const liffId = process.env.REACT_APP_LIFF_ID // isLocalhost ? '1657818347-OQA4wE9x'  //

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#root',
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

export default function App() {
  const theme = useMemo(
    () =>
      createTheme({
      }))

  const colorMode = useContext(ColorModeContext);

  const { user } = useAuthContext()
  // const liff = window.liff;

  const [profile, setProfile] = useState();
  const [cardTotal, setCardTotal] = useState("");

     return (<>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>        
        <AppContext.Provider value={{
          user,
          profile,
          setProfile,
          cardTotal,
          setCardTotal
        }}>
          <Router />
          <ScrollTop>
              <Fab size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
          </AppContext.Provider>
        
      </ThemeProvider>
    </ColorModeContext.Provider>
  </>
  );
}

export  function ToggleColorMode() {
  const [mode, setMode] = useState('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
        ? {
            // palette values for light mode
            primary: lightGreen,
            divider: lightGreen[200],
            text: {
              primary: grey[900],
              secondary: grey[800],
            },
          }
        : {
            // palette values for dark mode
            primary: blueGrey,
            divider: blueGrey[700],
            background: {
              default: blueGrey[900],
              paper: blueGrey[900],
            },
            text: {
              primary: '#fff',
              secondary: grey[500],
            },
          }),
        },
      }),
    [mode],
  );

  return (
    
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>      
      </ColorModeContext.Provider>
  );
}
