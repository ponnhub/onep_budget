import PropTypes from 'prop-types';
import { createContext, useMemo, useState } from 'react';
// @mui
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { lightGreen, blueGrey, grey, common } from '@mui/material/colors';
//
import palette from './palette';
import shadows from './shadows';
import typography from './typography';
import GlobalStyles from './globalStyles';
import customShadows from './customShadows';
import componentsOverride from './overrides';


// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ThemeProvider({ children }) {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [mode, setMode] = useState(defaultDark ? 'dark' : 'light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  
  const themeOptions = useMemo(
    () => ({
      palette: {
        mode,
        ...(!defaultDark
      ? {
          // palette values for light mode
          primary: lightGreen,
          divider: lightGreen[200],
          // background: {
          //   default: common[200],
          //   paper: common[200],
          // },
          text: {
            primary: '#000',
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
      shape: { borderRadius: 6 },
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
