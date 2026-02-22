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
        className="flex items-center gap-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-dashed border-slate-300 dark:border-gray-600 rounded-xl px-4 py-3 w-72 flex-shrink-0 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add column
      </button>
    );
  }

  return (
    <div className="bg-[#EBEBEB] dark:bg-gray-800/60 rounded-xl p-3 w-72 flex-shrink-0 space-y-2 border border-slate-200/60 dark:border-gray-700/50">
      <input
        data-testid="column-title-input"
        aria-label="Column title"
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') setAdding(false); }}
        placeholder="Column title"
        className="w-full text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-slate-200 dark:border-gray-600 rounded-lg px-3 py-1.5 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="flex gap-2">
        <button
          data-testid="add-column-submit"
          onClick={handleSubmit}
          className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add
        </button>
        <button
          onClick={() => setAdding(false)}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
