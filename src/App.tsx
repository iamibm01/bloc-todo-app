import { MainLayout } from './components/layout';
import { useApp } from './context/AppContext';

function App() {
  const { projects, tasks, activeProjectId } = useApp();

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Project Header */}
        {activeProject && (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div
                className="w-8 h-8 border-2 border-light-text-primary dark:border-dark-text-primary"
                style={{ backgroundColor: activeProject.color }}
              />
              <h1 className="text-4xl font-display font-bold text-light-text-primary dark:text-dark-text-primary">
                {activeProject.name}
              </h1>
            </div>
            {activeProject.description && (
              <p className="text-light-text-secondary dark:text-dark-text-secondary ml-12">
                {activeProject.description}
              </p>
            )}
          </div>
        )}

        {/* Task Count */}
        <div className="mb-6 p-4 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Total Tasks
              </p>
              <p className="text-3xl font-display font-bold text-light-text-primary dark:text-dark-text-primary">
                {projectTasks.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                To Do
              </p>
              <p className="text-2xl font-display font-bold text-pastel-blue dark:text-muted-blue">
                {projectTasks.filter((t) => t.status === 'todo').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                In Progress
              </p>
              <p className="text-2xl font-display font-bold text-pastel-orange dark:text-muted-orange">
                {projectTasks.filter((t) => t.status === 'inProgress').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Done
              </p>
              <p className="text-2xl font-display font-bold text-pastel-purple dark:text-muted-purple">
                {projectTasks.filter((t) => t.status === 'done').length}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder for Kanban Board */}
        <div className="p-12 bg-light-surface dark:bg-dark-surface border-2 border-dashed border-light-border dark:border-dark-border text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary font-display">
            Kanban Board Coming Soon! 🚀
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;