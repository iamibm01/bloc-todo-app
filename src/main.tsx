import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppWrapper } from './AppWrapper';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';  // NEW!
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppWrapper />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
