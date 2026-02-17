import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppWrapper } from './AppWrapper';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppProvider>
        <AppWrapper />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>
);
