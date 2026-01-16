import { useState } from 'react';
import { Button } from './Button';
import { generateDummyData } from '@/utils/dummyData';
import { useApp } from '@/context/AppContext';

export function DataLoader() {
  const { tasks, projects } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const hasData = tasks.length > 0 || projects.length > 1; // More than just Inbox

  const handleLoadData = () => {
    const { projects: dummyProjects, tasks: dummyTasks } = generateDummyData();
    
    // Store directly in localStorage
    localStorage.setItem('bloc_projects', JSON.stringify(dummyProjects));
    localStorage.setItem('bloc_tasks', JSON.stringify(dummyTasks));
    
    // Reload the page to load the new data
    window.location.reload();
  };

  if (!hasData) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-pastel-yellow dark:bg-muted-yellow border-2 border-light-text-primary dark:border-dark-text-primary p-4 shadow-lg max-w-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <h3 className="font-display font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                No Data Yet
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">
                Want to see how everything works? Load some sample projects and tasks!
              </p>
              <Button onClick={handleLoadData} variant="primary" size="sm" fullWidth>
                Load Sample Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Small button in corner for users who want to reload data */}
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary transition-all shadow-lg"
        title="Load sample data"
      >
        <span className="text-xl">🎲</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowConfirm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-light-surface dark:bg-dark-surface border-3 border-light-text-primary dark:border-dark-text-primary p-6 max-w-md">
              <h3 className="text-xl font-display font-bold text-light-text-primary dark:text-dark-text-primary mb-3">
                Load Sample Data?
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                This will replace all your current projects and tasks with sample data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleLoadData} variant="danger" fullWidth>
                  Replace Data
                </Button>
                <Button onClick={() => setShowConfirm(false)} variant="secondary" fullWidth>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}