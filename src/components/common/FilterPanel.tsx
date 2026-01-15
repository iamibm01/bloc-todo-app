import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Select } from '@/components/common';
import { SelectOption } from '@/components/common';
import { Filters, TaskPriority } from '@/types';
import { PRIORITY_LABELS } from '@/constants';

// ==========================================
// FILTER PANEL PROPS
// ==========================================

interface FilterPanelProps {
  filters: Filters;
  availableTags: string[];
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
  hasActiveFilters?: boolean;
}

// ==========================================
// FILTER PANEL COMPONENT
// ==========================================

export function FilterPanel({
  filters,
  availableTags,
  onFiltersChange,
  onClearFilters,
  hasActiveFilters,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Priority options
  const priorityOptions: SelectOption[] = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: PRIORITY_LABELS.high },
    { value: 'medium', label: PRIORITY_LABELS.medium },
    { value: 'low', label: PRIORITY_LABELS.low },
  ];

  // Handle priority change
  const handlePriorityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      priority: value ? (value as TaskPriority) : undefined,
    });
  };

  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    onFiltersChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined,
    });
  };

  // Handle date range change
  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const date = value ? new Date(value) : undefined;
    const currentRange = filters.dateRange;

    if (field === 'start') {
      onFiltersChange({
        ...filters,
        dateRange:
          date || currentRange?.end
            ? { start: date!, end: currentRange?.end || new Date() }
            : undefined,
      });
    } else {
      onFiltersChange({
        ...filters,
        dateRange:
          currentRange?.start || date
            ? { start: currentRange?.start || new Date(), end: date! }
            : undefined,
      });
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get selected and unselected tags
  const selectedTags = availableTags.filter((tag) => filters.tags?.includes(tag));
  const unselectedTags = availableTags.filter((tag) => !filters.tags?.includes(tag));

  return (
    <div className="relative" ref={panelRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative px-3 py-2 border-2 border-light-text-primary dark:border-dark-text-primary
          transition-colors duration-200
          ${
            isOpen || hasActiveFilters
              ? 'bg-pastel-pink dark:bg-muted-pink'
              : 'bg-light-surface dark:bg-dark-surface hover:bg-light-bg dark:hover:bg-dark-bg'
          }
        `}
        aria-label="Toggle filters"
      >
        {/* Funnel Icon */}
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
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>

        {/* Active Indicator Dot */}
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-pastel-red dark:bg-muted-red rounded-full border-2 border-light-surface dark:border-dark-surface" />
        )}
      </button>

      {/* Filter Panel Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-96 bg-light-surface dark:bg-dark-surface border-2 border-light-text-primary dark:border-dark-text-primary z-50 shadow-lg max-h-[calc(100vh-80px)] flex flex-col"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 border-b-2 border-light-border dark:border-dark-border flex-shrink-0">
              <h3 className="font-display font-bold text-light-text-primary dark:text-dark-text-primary">
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    onClearFilters();
                    setIsOpen(false);
                  }}
                  className="text-xs text-pastel-red dark:text-muted-red hover:underline font-display font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {/* Priority Filter */}
              <div>
                <Select
                  label="Filter by Priority"
                  options={priorityOptions}
                  value={filters.priority || ''}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                />
              </div>

              {/* Tags Filter */}
              {availableTags.length > 0 && (
                <div>
                  <label className="block mb-2 font-display font-semibold text-sm text-light-text-primary dark:text-dark-text-primary">
                    Filter by Tags
                    {filters.tags && filters.tags.length > 0 && (
                      <span className="ml-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        ({filters.tags.length} selected)
                      </span>
                    )}
                  </label>

                  {/* Selected Tags First */}
                  {selectedTags.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        Selected:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className="px-3 py-1 text-xs font-mono border-2 border-light-text-primary dark:border-dark-text-primary bg-pastel-accent dark:bg-muted-accent transition-all hover:scale-105"
                          >
                            ✓ {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unselected Tags - Scrollable if many */}
                  {unselectedTags.length > 0 && (
                    <div>
                      {selectedTags.length > 0 && (
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
                          Available:
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto p-2 border border-light-border dark:border-dark-border">
                        {unselectedTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className="px-3 py-1 text-xs font-mono border-2 border-light-border dark:border-dark-border hover:border-light-text-secondary dark:hover:border-dark-text-secondary transition-all hover:scale-105"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Date Range Filter */}
              <div>
                <label className="block mb-2 font-display font-semibold text-sm text-light-text-primary dark:text-dark-text-primary">
                  Filter by Due Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="date"
                      value={
                        filters.dateRange?.start
                          ? filters.dateRange.start.toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                      className="w-full px-3 py-2 bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary border-2 border-light-border dark:border-dark-border focus:border-light-text-primary dark:focus:border-dark-text-primary focus:outline-none text-sm"
                      placeholder="Start date"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={
                        filters.dateRange?.end
                          ? filters.dateRange.end.toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                      className="w-full px-3 py-2 bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary border-2 border-light-border dark:border-dark-border focus:border-light-text-primary dark:focus:border-dark-text-primary focus:outline-none text-sm"
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="p-4 border-t-2 border-light-border dark:border-dark-border flex-shrink-0">
              <Button onClick={() => setIsOpen(false)} variant="primary" fullWidth size="sm">
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}