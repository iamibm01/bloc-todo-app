import { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// SEARCHBAR PROPS
// ==========================================

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

// ==========================================
// SEARCHBAR COMPONENT
// ==========================================

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onClear, value, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={value}
          className={`
            w-full pl-10 pr-10 py-2
            bg-light-surface dark:bg-dark-surface
            text-light-text-primary dark:text-dark-text-primary
            border-2 border-light-border dark:border-dark-border
            focus:border-light-text-primary dark:focus:border-dark-text-primary
            focus:outline-none
            transition-colors duration-200
            font-body
            placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary
            ${className}
          `}
          {...props}
        />

        {/* Clear Button */}
        {value && onClear && (
          <motion.button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';