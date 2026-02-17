interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg p-4">
      <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-display font-bold text-red-800 dark:text-red-300 mb-2">
              Error Loading Data
            </h2>
            <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-display font-bold border-2 border-red-800 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
