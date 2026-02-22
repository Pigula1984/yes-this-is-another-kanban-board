import { useState } from 'react';

interface Props {
  columnId: number;
  onAdd: (title: string) => void;
}

export function AddCardForm({ columnId: _columnId, onAdd }: Props) {
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
        data-testid="add-card-btn"
        aria-label="Add new card"
        onClick={() => setAdding(true)}
        className="w-full text-left text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        + Add card
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <input
        data-testid="card-title-input"
        aria-label="Card title"
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') setAdding(false); }}
        placeholder="Card title"
        className="w-full text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-150"
      />
      <div className="flex gap-2">
        <button
          data-testid="add-card-submit"
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
