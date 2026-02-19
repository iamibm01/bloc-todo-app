import { LoadingSpinner, ErrorDisplay } from './components/common';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import App from './App';

export function AppWrapper() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: appLoading, error } = useApp();

  // Show loading spinner while checking authentication
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, show login/register page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show loading spinner while fetching app data
  if (appLoading) {
    return <LoadingSpinner />;
  }

  // Handle error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  // User is authenticated and data is loaded - show the app!
  return <App />;
}
