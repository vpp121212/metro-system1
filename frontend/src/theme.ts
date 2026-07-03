import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#0f2b5e" },
    secondary: { main: "#d4a843" },
    background: { default: "#f4f6f9" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 10, padding: "8px 20px" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
  },
});
