import { SelectHTMLAttributes, forwardRef } from 'react';

// ==========================================
// SELECT OPTION TYPE
// ==========================================

export interface SelectOption {
  value: string;
  label: string;
}

// ==========================================
// SELECT PROPS
// ==========================================

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

// ==========================================
// SELECT COMPONENT
// ==========================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block mb-2 font-display font-semibold text-sm text-light-text-primary dark:text-dark-text-primary">
            {label}
            {props.required && <span className="text-pastel-red dark:text-muted-red ml-1">*</span>}
          </label>
        )}

        {/* Select */}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2
            bg-light-surface dark:bg-dark-surface
            text-light-text-primary dark:text-dark-text-primary
            border-2 border-light-border dark:border-dark-border
            focus:border-light-text-primary dark:focus:border-dark-text-primary
            focus:outline-none
            transition-colors duration-200
            font-body
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
            ${error ? 'border-pastel-red dark:border-muted-red' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-pastel-red dark:text-muted-red font-body">
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary font-body">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';