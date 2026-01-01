import { TextareaHTMLAttributes, forwardRef } from 'react';

// ==========================================
// TEXTAREA PROPS
// ==========================================

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

// ==========================================
// TEXTAREA COMPONENT
// ==========================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block mb-2 font-display font-semibold text-sm text-light-text-primary dark:text-dark-text-primary">
            {label}
            {props.required && (
              <span className="text-pastel-red dark:text-muted-red ml-1">
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea */}
        <textarea
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
            placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${error ? 'border-pastel-red dark:border-muted-red' : ''}
            ${className}
          `}
          rows={4}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
