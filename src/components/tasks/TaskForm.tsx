import { useState, FormEvent } from 'react';
import { Input, Textarea, Select, Button, Tag } from '@/components/common';
import { SelectOption } from '@/components/common';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskPriority,
  TaskStatus,
} from '@/types';
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  MAX_LENGTHS,
  PASTEL_COLORS_LIGHT,
  PASTEL_COLORS_DARK,
} from '@/constants';
import {
  countWords,
  exceedsWordLimit,
  getWordCountMessage,
} from '@/utils/textHelpers';
import { useTheme } from '@/context/ThemeContext';

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

export function TaskForm({
  task,
  projectId,
  onSubmit,
  onCancel,
  isEditing = false,
}: TaskFormProps) {
  const { theme } = useTheme();
  const colors = theme === 'light' ? PASTEL_COLORS_LIGHT : PASTEL_COLORS_DARK;
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || 'medium'
  );
  const [status, setStatus] = useState<TaskStatus>(
    task?.status || 'brainstorm'
  );
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
    { value: 'brainstorm', label: STATUS_LABELS.brainstorm },
    { value: 'todo', label: STATUS_LABELS.todo },
    { value: 'inProgress', label: STATUS_LABELS.inProgress },
    { value: 'done', label: STATUS_LABELS.done },
  ];

  // Calculate word count and remaining
  const descriptionWordCount = countWords(description);
  const descriptionExceedsLimit = exceedsWordLimit(
    description,
    MAX_LENGTHS.TASK_DESCRIPTION_WORDS
  );
  const descriptionMessage = getWordCountMessage(
    description,
    MAX_LENGTHS.TASK_DESCRIPTION_WORDS
  );

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > MAX_LENGTHS.TASK_TITLE) {
      newErrors.title = `Title must be less than ${MAX_LENGTHS.TASK_TITLE} characters`;
    }

    if (description && descriptionExceedsLimit) {
      newErrors.description = `Description must be ${MAX_LENGTHS.TASK_DESCRIPTION_WORDS} words or less (currently ${descriptionWordCount} words)`;
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
    if (
      trimmedTag &&
      !tags.includes(trimmedTag) &&
      trimmedTag.length <= MAX_LENGTHS.TAG_NAME
    ) {
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
      <div>
        <Textarea
          label="Description"
          placeholder="Add more details... (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          rows={5}
        />
        {/* Word Count Display */}
        <div className="mt-1 flex items-center justify-between">
          <p
            className={`text-xs font-mono ${
              descriptionExceedsLimit
                ? 'text-pastel-red dark:text-muted-red font-semibold'
                : descriptionWordCount > MAX_LENGTHS.TASK_DESCRIPTION_WORDS - 20
                  ? 'text-pastel-orange dark:text-muted-orange'
                  : 'text-light-text-secondary dark:text-dark-text-secondary'
            }`}
          >
            {descriptionMessage}
          </p>
          {descriptionWordCount > 0 && (
            <button
              type="button"
              onClick={() => setDescription('')}
              className="text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

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
            helperText={
              tagInput.length > MAX_LENGTHS.TAG_NAME
                ? `Tag is too long (max ${MAX_LENGTHS.TAG_NAME} characters)`
                : ''
            }
          />
          <Button
            type="button"
            onClick={handleAddTag}
            disabled={
              !tagInput.trim() || tagInput.length > MAX_LENGTHS.TAG_NAME
            }
            variant="secondary"
          >
            Add
          </Button>
        </div>

        {/* Display Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Tag
                key={index}
                color={colors.accent}
                onRemove={() => handleRemoveTag(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t-2 border-light-border dark:border-dark-border">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={descriptionExceedsLimit}
        >
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" onClick={onCancel} variant="secondary" fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  );
}
