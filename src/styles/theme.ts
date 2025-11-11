import { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  colors: {
    background: "#ffffff",
    surface: "#f7f7f9",
    textPrimary: "#1f1f1f",
    textSecondary: "#5f5f70",
    accent: "#e91e63",
    accentHover: "#c2185b",
    onAccent: "#ffffff",
    border: "#e0e0e6",
    cardBackground: "#ffffff",
  },
  shadows: {
    card: "0 4px 16px rgba(0, 0, 0, 0.08)",
    cardHover: "0 8px 24px rgba(0, 0, 0, 0.16)",
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: "#0f1116",
    surface: "#1a1d24",
    textPrimary: "#f5f5f5",
    textSecondary: "#c4c7d0",
    accent: "#ff5c8d",
    accentHover: "#ff7aa4",
    onAccent: "#0f1116",
    border: "#2d313a",
    cardBackground: "#1c1f26",
  },
  shadows: {
    card: "0 4px 16px rgba(0, 0, 0, 0.4)",
    cardHover: "0 8px 24px rgba(0, 0, 0, 0.55)",
  },
};

