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
        onClick={() => setAdding(true)}
        className="w-full text-left text-sm text-gray-500 hover:text-gray-700 py-1 px-2 hover:bg-gray-100 rounded transition-colors"
      >
        + Add card
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <input
        data-testid="card-title-input"
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') setAdding(false); }}
        placeholder="Card title"
        className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <button
          data-testid="add-card-submit"
          onClick={handleSubmit}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
        <button
          onClick={() => setAdding(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
