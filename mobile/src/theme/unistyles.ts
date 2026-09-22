import { StyleSheet } from 'react-native-unistyles';
import { lightColors, darkColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radius } from './radius';
import { shadows } from './shadows';

const lightTheme = {
  colors: lightColors,
  spacing,
  typography,
  radius,
  shadows,
};

const darkTheme = {
  colors: darkColors,
  spacing,
  typography,
  radius,
  shadows,
};

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    initialTheme: 'light',
  },
});
