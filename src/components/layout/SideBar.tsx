import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';

// ==========================================
// SIDEBAR COMPONENT
// ==========================================

export function Sidebar() {
  const { projects, activeProjectId, setActiveProject, createProject } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
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
    setActiveProject(null);
    window.dispatchEvent(new CustomEvent('navigate-archive'));
  };

  const handleProjectClick = (projectId: string) => {
    setActiveProject(projectId);
    window.dispatchEvent(new CustomEvent('navigate-project'));
  };

  return (
    <motion.aside
      className="h-full bg-light-surface dark:bg-dark-surface border-r-3 border-light-text-primary dark:border-dark-text-primary flex flex-col relative"
      initial={false}
      animate={{ width: isExpanded ? '280px' : '60px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setIsCreating(false);
        setNewProjectName('');
      }}
    >
      {/* Header */}
      <div className="p-4 border-b-2 border-light-border dark:border-dark-border flex items-center justify-between">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.h2
              key="expanded"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-display font-bold text-lg text-light-text-primary dark:text-dark-text-primary"
            >
              Projects
            </motion.h2>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              {projects.map((project) => (
                <motion.button
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-2 border-2 border-light-text-primary dark:border-dark-text-primary"
                >
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
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => setIsCreating(true)}
                  className="w-full px-3 py-2 mt-2 border-2 border-dashed border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-all flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
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
                </motion.button>
              )}

              {/* Archive Button */}
              <motion.div
                className="mt-4 pt-4 border-t-2 border-light-border dark:border-dark-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <button
                  onClick={handleArchiveClick}
                  className="w-full px-3 py-2 border-2 border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-all flex items-center gap-2"
                >
                  <span className="text-lg">📦</span>
                  <span className="text-sm font-display font-semibold">Archive</span>
                </button>
              </motion.div>
            </motion.div>
          ) : (
            // Collapsed State - Icons Only
            <motion.div
              key="collapsed-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {projects.map((project) => (
                <motion.button
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className={`
                    w-full h-10 flex items-center justify-center
                    border-2 transition-all
                    ${
                      activeProjectId === project.id
                        ? 'border-light-text-primary dark:border-dark-text-primary'
                        : 'border-transparent hover:border-light-border dark:hover:border-dark-border'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={project.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="w-6 h-6 border border-light-text-primary dark:border-dark-text-primary"
                    style={{ backgroundColor: project.color }}
                  />
                </motion.button>
              ))}

              {/* Archive Button Collapsed */}
              <div className="pt-4 border-t-2 border-light-border dark:border-dark-border">
                <motion.button
                  onClick={handleArchiveClick}
                  className="w-full h-10 flex items-center justify-center border-2 border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Archive"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-lg">📦</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}