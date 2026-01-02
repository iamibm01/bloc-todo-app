import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { SearchBar, FilterPanel } from '@/components/common';

// ==========================================
// TOPBAR COMPONENT
// ==========================================

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    clearFilters,
    tasks,
  } = useApp();

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags)));

  return (
    <header className="sticky top-0 z-50 bg-light-surface dark:bg-dark-surface border-b-3 border-light-text-primary dark:border-dark-text-primary">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        {/* Left: App Name */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-display font-bold text-light-text-primary dark:text-dark-text-primary">
            BLOC
          </h1>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>

        {/* Right: Filter + View Toggle + Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            availableTags={allTags}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />

          {/* View Mode Toggle */}
          <div className="flex border-2 border-light-text-primary dark:border-dark-text-primary">
            <button
              onClick={() => setViewMode('kanban')}
              className={`
                px-3 py-2 font-display font-semibold text-sm
                transition-colors duration-200
                ${
                  viewMode === 'kanban'
                    ? 'bg-pastel-blue dark:bg-muted-blue text-light-text-primary dark:text-dark-text-primary'
                    : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                }
              `}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                px-3 py-2 font-display font-semibold text-sm
                transition-colors duration-200 border-l-2 border-light-text-primary dark:border-dark-text-primary
                ${
                  viewMode === 'list'
                    ? 'bg-pastel-blue dark:bg-muted-blue text-light-text-primary dark:text-dark-text-primary'
                    : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                }
              `}
            >
              List
            </button>
          </div>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 border-2 border-light-text-primary dark:border-dark-text-primary bg-light-surface dark:bg-dark-surface hover:bg-pastel-yellow dark:hover:bg-muted-yellow transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              // Moon icon for dark mode
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-light-text-primary dark:text-dark-text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              // Sun icon for light mode
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-light-text-primary dark:text-dark-text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}