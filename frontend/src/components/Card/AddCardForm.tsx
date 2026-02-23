import { useState } from 'react';

interface Props {
  columnId: number;
  onAdd: (title: string, assignee?: string, dueDate?: string) => void;
}

export function AddCardForm({ columnId: _columnId, onAdd }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim(), assignee || undefined, dueDate || undefined);
      setTitle('');
      setAssignee('');
      setDueDate('');
      setAdding(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setAssignee('');
    setDueDate('');
    setAdding(false);
  };

  if (!adding) {
    return (
      <button
        data-testid="add-card-btn"
        aria-label="Add new card"
        onClick={() => setAdding(true)}
        className="w-full flex items-center gap-1.5 text-left text-xs text-gray-500 dark:text-gray-400 py-1.5 px-2 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
      >
        <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add card
      </button>
    );
  }

  return (
    <div className="space-y-2 p-1">
      <input
        data-testid="card-title-input"
        aria-label="Card title"
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') handleCancel(); }}
        placeholder="Card title"
        className="w-full text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-slate-200 dark:border-gray-600 rounded-lg px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      />
      <input
        data-testid="card-assignee-input"
        aria-label="Assignee"
        type="text"
        value={assignee}
        onChange={e => setAssignee(e.target.value)}
        placeholder="Assignee (optional)"
        className="w-full text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-slate-200 dark:border-gray-600 rounded-lg px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      />
      <input
        data-testid="card-due-date-input"
        aria-label="Due date"
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="w-full text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-slate-200 dark:border-gray-600 rounded-lg px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      />
      <div className="flex gap-2">
        <button
          data-testid="add-card-submit"
          onClick={handleSubmit}
          className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add
        </button>
        <button
          onClick={handleCancel}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
