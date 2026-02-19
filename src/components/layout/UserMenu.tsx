import { useAuth } from '@/context/AuthContext';

export function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <div className="p-4 border-t-2 border-light-text-primary dark:border-dark-text-primary">
      <div className="mb-3">
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
          Signed in as
        </p>
        <p className="text-sm font-display font-bold text-light-text-primary dark:text-dark-text-primary truncate">
          {user?.email}
        </p>
        {user?.name && (
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
            {user.name}
          </p>
        )}
      </div>

      <button
        onClick={logout}
        className="w-full py-2 px-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-400 font-display font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
