import { motion, AnimatePresence } from 'framer-motion';
import { getModifierKey } from '@/hooks/useKeyboardShortcuts';

// ==========================================
// KEYBOARD SHORTCUTS MODAL PROPS
// ==========================================

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ==========================================
// SHORTCUT GROUPS
// ==========================================

const shortcutGroups = [
  {
    title: 'General',
    shortcuts: [
      { key: 'N', description: 'Create new task' },
      { key: '/', description: 'Focus search bar' },
      { key: 'Esc', description: 'Close modal / Clear search' },
      { key: '?', description: 'Show keyboard shortcuts' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { key: 'K', description: 'Switch to Kanban view' },
      { key: 'L', description: 'Switch to List view' },
      { key: 'F', description: 'Toggle filter panel' },
      { key: 'A', description: 'Toggle archive view' },
    ],
  },
  {
    title: 'Filters',
    shortcuts: [
      { key: '1', description: 'Filter by High priority' },
      { key: '2', description: 'Filter by Medium priority' },
      { key: '3', description: 'Filter by Low priority' },
      { key: '0', description: 'Clear priority filter' },
    ],
  },
  {
    title: 'Advanced',
    shortcuts: [
      {
        key: `${getModifierKey()} + K`,
        description: 'Quick command (coming soon)',
      },
    ],
  },
];

// ==========================================
// KEYBOARD SHORTCUTS MODAL COMPONENT
// ==========================================

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-light-surface dark:bg-dark-surface border-3 border-light-text-primary dark:border-dark-text-primary max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-light-border dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⌨️</span>
                  <h2 className="text-2xl font-display font-bold text-light-text-primary dark:text-dark-text-primary">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-light-text-primary dark:text-dark-text-primary"
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
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {shortcutGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-lg font-display font-bold text-light-text-primary dark:text-dark-text-primary mb-3">
                      {group.title}
                    </h3>
                    <div className="space-y-2">
                      {group.shortcuts.map((shortcut) => (
                        <div
                          key={shortcut.key}
                          className="flex items-center justify-between p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border"
                        >
                          <span className="text-light-text-primary dark:text-dark-text-primary">
                            {shortcut.description}
                          </span>
                          <kbd className="px-3 py-1 bg-light-surface dark:bg-dark-surface border-2 border-light-text-primary dark:border-dark-text-primary font-mono text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Footer Tip */}
                <div className="pt-4 border-t-2 border-light-border dark:border-dark-border">
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary text-center">
                    💡 Tip: Shortcuts work everywhere except when typing in text
                    fields
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
