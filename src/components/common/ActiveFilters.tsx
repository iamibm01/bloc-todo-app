import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '@/components/common';
import { Filters } from '@/types';
import { PRIORITY_LABELS } from '@/constants';
import { formatDateShort } from '@/utils/dateHelpers';

// ==========================================
// ACTIVE FILTERS PROPS
// ==========================================

interface ActiveFiltersProps {
  filters: Filters;
  onRemovePriority: () => void;
  onRemoveTag: (tag: string) => void;
  onRemoveDateRange: () => void;
}

// ==========================================
// ACTIVE FILTERS COMPONENT
// ==========================================

export function ActiveFilters({
  filters,
  onRemovePriority,
  onRemoveTag,
  onRemoveDateRange,
}: ActiveFiltersProps) {
  const hasFilters =
    filters.priority || (filters.tags && filters.tags.length > 0) || filters.dateRange;

  if (!hasFilters) return null;

  return (
    <motion.div
      className="flex flex-wrap items-center gap-2 p-3 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border mb-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <span className="text-sm font-display font-semibold text-light-text-secondary dark:text-dark-text-secondary">
        Active Filters:
      </span>

      <AnimatePresence mode="popLayout">
        {/* Priority Filter */}
        {filters.priority && (
          <motion.div
            key="priority"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Tag variant="priority" priority={filters.priority} onRemove={onRemovePriority}>
              {PRIORITY_LABELS[filters.priority]}
            </Tag>
          </motion.div>
        )}

        {/* Tag Filters */}
        {filters.tags?.map((tag) => (
          <motion.div
            key={tag}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Tag onRemove={() => onRemoveTag(tag)}>{tag}</Tag>
          </motion.div>
        ))}

        {/* Date Range Filter */}
        {filters.dateRange && (
          <motion.div
            key="dateRange"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Tag onRemove={onRemoveDateRange}>
              {formatDateShort(filters.dateRange.start)} →{' '}
              {formatDateShort(filters.dateRange.end)}
            </Tag>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}