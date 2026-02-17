import { LoadingSpinner, ErrorDisplay } from './components/common';
import { useApp } from './context/AppContext';
import App from './App';

export function AppWrapper() {
  const { isLoading, error } = useApp();

  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Handle error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  // Render actual app
  return <App />;
}
