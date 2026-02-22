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
        onClick={() => setAdding(true)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl px-4 py-3 w-72 flex-shrink-0 text-sm font-medium transition-colors text-left"
      >
        + Add column
      </button>
    );
  }

  return (
    <div className="bg-gray-100 rounded-xl p-3 w-72 flex-shrink-0 space-y-2">
      <input
        data-testid="column-title-input"
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') setAdding(false); }}
        placeholder="Column title"
        className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <button
          data-testid="add-column-submit"
          onClick={handleSubmit}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
        <button onClick={() => setAdding(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
      </div>
    </div>
  );
}
