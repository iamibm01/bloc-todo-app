import { useTheme } from './context/ThemeContext';
import { useApp } from './context/AppContext';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { projects, tasks, createTask, createProject } = useApp();

  // Test function to create a sample project
  const handleCreateProject = () => {
    createProject({
      name: 'My First Project',
      description: 'Testing the context!',
    });
  };

  // Test function to create a sample task
// Test function to create a sample task
const handleCreateTask = () => {
  const firstProject = projects[0];
  if (firstProject) {
    createTask({
      title: 'My First Task',
      description: 'Testing task creation!',
      projectId: firstProject.id,
      priority: 'high',
    });
  }
};

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display text-light-text-primary dark:text-dark-text-primary mb-4">
          Bloc - Task Management
        </h1>
        
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">
          Current theme: <span className="font-mono">{theme}</span>
        </p>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-pastel-pink dark:bg-muted-pink text-light-text-primary dark:text-dark-text-primary rounded border-2 border-light-text-primary dark:border-dark-text-primary mb-8 hover:scale-105 transition-transform"
        >
          Toggle Theme
        </button>

        {/* Test Buttons */}
        <div className="space-x-4 mb-8">
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-pastel-blue dark:bg-muted-blue text-light-text-primary dark:text-dark-text-primary rounded border-2 border-light-text-primary dark:border-dark-text-primary hover:scale-105 transition-transform"
          >
            Create Test Project
          </button>
          
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-pastel-green dark:bg-muted-green text-light-text-primary dark:text-dark-text-primary rounded border-2 border-light-text-primary dark:border-dark-text-primary hover:scale-105 transition-transform"
          >
            Create Test Task
          </button>
        </div>

        {/* Display Projects */}
        <div className="mb-8">
          <h2 className="text-2xl font-display mb-4 text-light-text-primary dark:text-dark-text-primary">
            Projects ({projects.length})
          </h2>
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded"
                style={{ borderLeftColor: project.color, borderLeftWidth: '4px' }}
              >
                <h3 className="font-display text-light-text-primary dark:text-dark-text-primary">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Display Tasks */}
        <div>
          <h2 className="text-2xl font-display mb-4 text-light-text-primary dark:text-dark-text-primary">
            Tasks ({tasks.length})
          </h2>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded"
              >
                <h3 className="font-display text-light-text-primary dark:text-dark-text-primary">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {task.description}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-pastel-red dark:bg-muted-red">
                    {task.priority}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-pastel-blue dark:bg-muted-blue">
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;