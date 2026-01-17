"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
    position: relative;
  }

  html {
    position: relative;
  }

  html::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/topo.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.2;
    z-index: 0;
    pointer-events: none;
  }

  body {
    margin: 0;
    min-height: 100%;
    width: 100%;
    max-width: 100vw;
    font-family: "Inter", sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: background 0.2s ease, color 0.2s ease;
    z-index: 1;
  }

  a {
    color: inherit;
  }
`;

