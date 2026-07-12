import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2563eb" },
    secondary: { main: "#06b6d4" },
    background: {
      default: "#060b18",
      paper: "#0d1321",
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
    },
    error: { main: "#dc2626" },
    warning: { main: "#eab308" },
    success: { main: "#16a34a" },
  },
  typography: {
    fontFamily: "'Cairo', 'Inter', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#060b18",
          color: "#e2e8f0",
          "&::-webkit-scrollbar": { width: 5, height: 5 },
          "&::-webkit-scrollbar-track": { background: "#060b18" },
          "&::-webkit-scrollbar-thumb": { background: "#1e2a42", borderRadius: 3 },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
