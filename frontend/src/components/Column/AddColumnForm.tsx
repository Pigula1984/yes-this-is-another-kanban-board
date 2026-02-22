import { useState } from 'react';

interface Props {
  onAdd: (title: string) => void;
}

export function AddColumnForm({ onAdd }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setAdding(false);
    }
  };

  if (!adding) {
    return (
      <button
        data-testid="add-column-btn"
        aria-label="Add new column"
        onClick={() => setAdding(true)}
        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl px-4 py-3 w-72 flex-shrink-0 text-sm font-medium transition-colors duration-150 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        + Add column
      </button>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 w-72 flex-shrink-0 space-y-2 transition-colors duration-200">
      <input
        data-testid="column-title-input"
        aria-label="Column title"
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') setAdding(false); }}
        placeholder="Column title"
        className="w-full text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-150"
      />
      <div className="flex gap-2">
        <button
          data-testid="add-column-submit"
          onClick={handleSubmit}
          className="text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Add
        </button>
        <button
          onClick={() => setAdding(false)}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
