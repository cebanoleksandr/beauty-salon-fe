// theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B86F68',      // Основний б’юті-акцент (пильна троянда / теракота)
      light: '#D3918B',
      dark: '#8E4A44',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C6A87D',      // Теплий нюд / м'яке золото для деталей, зірок та бейджів
      light: '#E0CAAA',
      dark: '#9A7D53',
      contrastText: '#1E1E1E',
    },
    background: {
      default: '#FBF9F8',   // Теплий нейтральний фон сторінки
      paper: '#FFFFFF',     // Фон карток салонів, майстрів та модальних вікон
    },
    text: {
      primary: '#242120',   // Глибокий графіт (м'якший за чистий #000000)
      secondary: '#6E6765', // Другорядний текст (адреси, тривалість послуг)
      disabled: '#AFA8A6',
    },
    divider: '#EFE7E4',
    action: {
      hover: 'rgba(184, 111, 104, 0.06)',
      selected: 'rgba(184, 111, 104, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    h1: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', // Прибирає примусовий UPPERCASE для елегантного вигляду
    },
  },
  shape: {
    borderRadius: 14, // Плавні округлені кути карток та кнопок
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 22px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px -2px rgba(36, 33, 32, 0.05)',
          border: '1px solid #EFE7E4',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme);
