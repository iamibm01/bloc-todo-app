import { useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { useApp } from './context/AppContext';
import {
  Button,
  Input,
  Textarea,
  Select,
  Tag,
  SearchBar,
} from './components/common';
import type { SelectOption } from './components/common';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { projects, createProject, createTask } = useApp();
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  const priorityOptions: SelectOption[] = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const handleCreateProject = () => {
    createProject({
      name: 'Test Project',
      description: 'Testing components!',
    });
  };

  const handleCreateTask = () => {
    const firstProject = projects[0];
    if (firstProject) {
      createTask({
        title: 'Test Task',
        projectId: firstProject.id,
        priority: 'high',
      });
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-display text-light-text-primary dark:text-dark-text-primary">
          Bloc - Component Library
        </h1>

        {/* Theme Toggle */}
        <div className="p-6 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border">
          <h2 className="text-2xl font-display mb-4 text-light-text-primary dark:text-dark-text-primary">
            Theme: {theme}
          </h2>
          <Button onClick={toggleTheme}>Toggle Theme</Button>
        </div>

        {/* Buttons */}
        <div className="p-6 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border space-y-4">
          <h2 className="text-2xl font-display mb-4 text-light-text-primary dark:text-dark-text-primary">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" onClick={handleCreateProject}>
              Create Project
            </Button>
            <Button variant="secondary" onClick={handleCreateTask}>
              Create Task
            </Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
          </div>
        </div>

        {/* Inputs */}
        <div className="p-6 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border space-y-4">
          <h2 className="text-2xl font-display mb-4 text-light-text-primary dark:text-dark-text-primary">
            Inputs
          </h2>
          <Input
            label="Task Title"
            placeholder="Enter task title..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            helperText="This is a helper text"
          />
          <Input
            label="Required Field"
            placeholder="This field is required"
            required
          />
          <Input
            label="Error State"
            placeholder="This has an error"
            error="This field is required"
          />
          <Textarea
            label="Description"
            placeholder="Enter description..."
            helperText="Describe your task in detail"
          />
        </div>

        {/* Select */}
        <div className="p-6 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border space-y-4">
          <h2 className="text-2xl font-display mb-4 text-light-text-primary dark:text-dark-text-primary">
            Select
          </h2>
          <Select
            label="Priority"
            options={priorityOptions}
            helperText="Choose task priority"
          />
        </div>

        {/* Tags */}
        <div className="p-6 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border space-y-4">
          <h2 className="text-2xl font-display mb-4 text-light-text-primary dark:text-dark-text-primary">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            <Tag variant="priority" priority="high">
              High Priority
            </Tag>
            <Tag variant="priority" priority="medium">
              Medium Priority
            </Tag>
            <Tag variant="priority" priority="low">
              Low Priority
            </Tag>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tag variant="status" status="todo">
              To Do
            </Tag>
            <Tag variant="status" status="inProgress">
              In Progress
            </Tag>
            <Tag variant="status" status="done">
              Done
            </Tag>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tag color="#FFB3BA" onRemove={() => alert('Remove!')}>
              Removable Tag
            </Tag>
            <Tag color="#BAFFC9">Custom Color</Tag>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border space-y-4">
          <h2 className="text-2xl font-display mb-4 text-light-text-primary dark:text-dark-text-primary">
            Search Bar
          </h2>
          <SearchBar
            placeholder="Search tasks..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue('')}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
