import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';

// ==========================================
// SIDEBAR COMPONENT
// ==========================================

export function Sidebar() {
  const { projects, activeProjectId, setActiveProject, createProject } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject({ name: newProjectName.trim() });
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateProject();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewProjectName('');
    }
  };

  const handleArchiveClick = () => {
    // Set a special "archive" view
    setActiveProject(null);
    window.dispatchEvent(new CustomEvent('navigate-archive'));
  };

  return (
    <motion.aside
      className="h-full bg-light-surface dark:bg-dark-surface border-r-3 border-light-text-primary dark:border-dark-text-primary flex flex-col"
      initial={false}
      animate={{ width: isCollapsed ? '60px' : '280px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="p-4 border-b-2 border-light-border dark:border-dark-border flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="font-display font-bold text-lg text-light-text-primary dark:text-dark-text-primary">
            Projects
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
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
              d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
            />
          </svg>
        </button>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {projects.map((project) => (
                <motion.button
                  key={project.id}
                  onClick={() => {
                    setActiveProject(project.id);
                    // Clear archive view if it was active
                    window.dispatchEvent(new CustomEvent('navigate-project'));
                  }}
                  className={`
                    w-full px-3 py-2 text-left
                    border-2 transition-all duration-200
                    ${
                      activeProjectId === project.id
                        ? 'border-light-text-primary dark:border-dark-text-primary bg-light-bg dark:bg-dark-bg'
                        : 'border-transparent hover:border-light-border dark:hover:border-dark-border'
                    }
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 border border-light-text-primary dark:border-dark-text-primary flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-display font-semibold text-sm text-light-text-primary dark:text-dark-text-primary truncate">
                      {project.name}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1 truncate">
                      {project.description}
                    </p>
                  )}
                </motion.button>
              ))}

              {/* Create Project */}
              {isCreating ? (
                <div className="mt-2 p-2 border-2 border-light-text-primary dark:border-dark-text-primary">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Project name..."
                    autoFocus
                    className="w-full px-2 py-1 bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border focus:outline-none focus:border-light-text-primary dark:focus:border-dark-text-primary text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleCreateProject}
                      className="flex-1 px-2 py-1 bg-pastel-green dark:bg-muted-green text-light-text-primary dark:text-dark-text-primary border border-light-text-primary dark:border-dark-text-primary text-xs font-display font-semibold hover:scale-105 transition-transform"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setNewProjectName('');
                      }}
                      className="flex-1 px-2 py-1 bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border text-xs font-display font-semibold hover:scale-105 transition-transform"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full px-3 py-2 mt-2 border-2 border-dashed border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-sm font-display font-semibold">New Project</span>
                </button>
              )}

              {/* Archive Button */}
              <div className="mt-4 pt-4 border-t-2 border-light-border dark:border-dark-border">
                <button
                  onClick={handleArchiveClick}
                  className="w-full px-3 py-2 border-2 border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-all flex items-center gap-2"
                >
                  <span className="text-lg">📦</span>
                  <span className="text-sm font-display font-semibold">Archive</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Collapsed State */}
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {projects.map((project) => (
                <motion.button
                  key={project.id}
                  onClick={() => setActiveProject(project.id)}
                  className={`
                    w-full h-10 flex items-center justify-center
                    border-2 transition-all
                    ${
                      activeProjectId === project.id
                        ? 'border-light-text-primary dark:border-dark-text-primary'
                        : 'border-transparent hover:border-light-border dark:hover:border-dark-border'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={project.name}
                >
                  <div
                    className="w-6 h-6 border border-light-text-primary dark:border-dark-text-primary"
                    style={{ backgroundColor: project.color }}
                  />
                </motion.button>
              ))}

              {/* Archive Button Collapsed */}
              <div className="pt-4 border-t-2 border-light-border dark:border-dark-border">
                <button
                  onClick={handleArchiveClick}
                  className="w-full h-10 flex items-center justify-center border-2 border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary transition-all"
                  title="Archive"
                >
                  <span className="text-lg">📦</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}