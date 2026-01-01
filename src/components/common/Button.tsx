import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

// ==========================================
// BUTTON VARIANTS
// ==========================================

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// ==========================================
// BUTTON PROPS
// ==========================================

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof MotionProps
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

// ==========================================
// STYLE CONFIGS
// ==========================================

const baseStyles =
  'font-display font-semibold border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-pastel-pink dark:bg-muted-pink text-light-text-primary dark:text-dark-text-primary border-light-text-primary dark:border-dark-text-primary hover:scale-105 active:scale-95',
  secondary:
    'bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary hover:scale-105 active:scale-95',
  danger:
    'bg-pastel-red dark:bg-muted-red text-light-text-primary dark:text-dark-text-primary border-light-text-primary dark:border-dark-text-primary hover:scale-105 active:scale-95',
  ghost:
    'bg-transparent text-light-text-primary dark:text-dark-text-primary border-transparent hover:bg-light-surface dark:hover:bg-dark-surface hover:border-light-border dark:hover:border-dark-border',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

// ==========================================
// BUTTON COMPONENT
// ==========================================

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  fullWidth = false,
  disabled,
  className = '',
  onClick,
  type = 'button',
  ...props
}: ButtonProps) {
  const styles = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  return (
    <motion.button
      type={type}
      className={styles}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={disabled || isLoading ? {} : { scale: 1.05 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.95 }}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <motion.span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
