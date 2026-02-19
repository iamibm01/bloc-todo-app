import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      clearError();
      await register(email, password, name || undefined);
      // Success! Auth context will update and redirect
    } catch (err) {
      // Error is handled by auth context
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 border-2 border-light-text-primary dark:border-dark-text-primary p-8">
        <h2 className="text-3xl font-display font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-display font-bold text-light-text-primary dark:text-dark-text-primary mb-2"
            >
              Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border-2 border-light-text-primary dark:border-dark-text-primary bg-white dark:bg-gray-700 text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              placeholder="Your name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-display font-bold text-light-text-primary dark:text-dark-text-primary mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-light-text-primary dark:border-dark-text-primary bg-white dark:bg-gray-700 text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-display font-bold text-light-text-primary dark:text-dark-text-primary mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-light-text-primary dark:border-dark-text-primary bg-white dark:bg-gray-700 text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              placeholder="••••••••"
              required
              disabled={isLoading}
              minLength={6}
            />
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
              Must be at least 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-pastel-pink dark:bg-muted-pink border-2 border-light-text-primary dark:border-dark-text-primary font-display font-bold text-light-text-primary dark:text-dark-text-primary hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary underline"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
