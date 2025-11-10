import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      textPrimary: string;
      textSecondary: string;
      accent: string;
      accentHover: string;
      border: string;
      cardBackground: string;
    };
    shadows: {
      card: string;
      cardHover: string;
    };
  }
}

