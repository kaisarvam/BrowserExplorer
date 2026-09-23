import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  :root {
    color-scheme: ${({ theme }) => theme.scheme};
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.surface};
    -webkit-font-smoothing: antialiased;
  }

  body,
  #root {
    min-height: 100vh;
  }

  h1,
  h2,
  h3,
  h4 {
    line-height: 1.25;
    font-weight: 600;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  ul,
  ol {
    list-style: none;
    padding: 0;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
`;
