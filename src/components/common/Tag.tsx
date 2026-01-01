import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { TaskPriority, TaskStatus } from '@/types';
import { PASTEL_COLORS_LIGHT, PASTEL_COLORS_DARK } from '@/constants';
import { useTheme } from '@/context/ThemeContext';

// ==========================================
// TAG PROPS
// ==========================================

interface TagProps {
  children: ReactNode;
  variant?: 'priority' | 'status' | 'custom';
  priority?: TaskPriority;
  status?: TaskStatus;
  color?: string;
  onRemove?: () => void;
  className?: string;
}

// ==========================================
// TAG COMPONENT
// ==========================================

export function Tag({
  children,
  variant = 'custom',
  priority,
  status,
  color,
  onRemove,
  className = '',
}: TagProps) {
  const { theme } = useTheme();
  
  // Determine background color
  let bgColor = color || '#E0E0E0';
  
  if (variant === 'priority' && priority) {
    const colors = theme === 'light' ? PASTEL_COLORS_LIGHT : PASTEL_COLORS_DARK;
    bgColor = colors[priority];
  }
  
  if (variant === 'status' && status) {
    const colors = theme === 'light' ? PASTEL_COLORS_LIGHT : PASTEL_COLORS_DARK;
    bgColor = colors[status];
  }

  return (
    <motion.span
      className={`
        inline-flex items-center gap-1 px-2 py-1
        text-xs font-mono font-medium
        border border-light-text-primary dark:border-dark-text-primary
        text-light-text-primary dark:text-dark-text-primary
        ${className}
      `}
      style={{ backgroundColor: bgColor }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:scale-125 transition-transform"
          aria-label="Remove tag"
        >
          ×
        </button>
      )}
    </motion.span>
  );
}