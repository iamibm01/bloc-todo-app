import { useState, FormEvent } from 'react';
import { Input, Textarea, Select, Button, Tag } from '@/components/common';
import { SelectOption } from '@/components/common';
import { Task, CreateTaskInput, UpdateTaskInput, TaskPriority, TaskStatus } from '@/types';
import { PRIORITY_LABELS, STATUS_LABELS } from '@/constants';

// ==========================================
// TASK FORM PROPS
// ==========================================

interface TaskFormProps {
  task?: Task;
  projectId: string;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

// ==========================================
// TASK FORM COMPONENT
// ==========================================

export function TaskForm({ task, projectId, onSubmit, onCancel, isEditing = false }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
  );
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Priority options
  const priorityOptions: SelectOption[] = [
    { value: 'high', label: PRIORITY_LABELS.high },
    { value: 'medium', label: PRIORITY_LABELS.medium },
    { value: 'low', label: PRIORITY_LABELS.low },
  ];

  // Status options
  const statusOptions: SelectOption[] = [
    { value: 'todo', label: STATUS_LABELS.todo },
    { value: 'inProgress', label: STATUS_LABELS.inProgress },
    { value: 'done', label: STATUS_LABELS.done },
  ];

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (description && description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const formData: CreateTaskInput | UpdateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      tags,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      ...(isEditing ? { status } : { projectId }),
    };

    onSubmit(formData);
  };

  // Add tag
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && trimmedTag.length <= 20) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <Input
        label="Task Title"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
        autoFocus
      />

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Add more details... (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        rows={3}
      />

      {/* Priority and Status */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        />

        {isEditing && (
          <Select
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          />
        )}
      </div>

      {/* Due Date */}
      <Input
        type="date"
        label="Due Date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        helperText="Optional deadline for this task"
      />

      {/* Tags */}
      <div>
        <label className="block mb-2 font-display font-semibold text-sm text-light-text-primary dark:text-dark-text-primary">
          Tags
        </label>
        
        {/* Tag Input */}
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyPress}
            helperText={tagInput.length > 20 ? 'Tag is too long (max 20 characters)' : ''}
          />
          <Button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || tagInput.length > 20}
            variant="secondary"
          >
            Add
          </Button>
        </div>

        {/* Display Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Tag key={index} onRemove={() => handleRemoveTag(tag)}>
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t-2 border-light-border dark:border-dark-border">
        <Button type="submit" variant="primary" fullWidth>
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" onClick={onCancel} variant="secondary" fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  );
}