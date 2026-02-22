import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Column, Card } from '../../api/client';
import { CardItem } from '../Card/CardItem';
import { AddCardForm } from '../Card/AddCardForm';

interface Props {
  column: Column;
  cards: Card[];
  onAddCard: (columnId: number, title: string) => void;
  onDeleteCard: (cardId: number) => void;
  onDeleteColumn: (columnId: number) => void;
}

export function ColumnItem({ column, cards, onAddCard, onDeleteCard, onDeleteColumn }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const { setNodeRef } = useDroppable({ id: `column-${column.id}` });

  const sortedCards = [...cards].sort((a, b) => a.position - b.position);

  return (
    <section
      data-testid={`column-${column.id}`}
      aria-label={`Column: ${column.title}, ${cards.length} cards`}
      className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 w-72 flex-shrink-0 flex flex-col gap-3 transition-colors duration-200"
    >
      <div className="flex justify-between items-center">
        {isEditing ? (
          <input
            autoFocus
            aria-label="Column title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={e => { if (e.key === 'Enter') setIsEditing(false); }}
            className="text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-0.5 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-150"
          />
        ) : (
          <h3
            data-testid={`column-title-${column.id}`}
            className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex-1 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {column.title} <span className="text-gray-400 dark:text-gray-500 font-normal">({cards.length})</span>
          </h3>
        )}
        <button
          data-testid={`column-delete-${column.id}`}
          aria-label={`Delete column ${column.title}`}
          onClick={() => onDeleteColumn(column.id)}
          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 text-xs ml-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
        >
          ✕
        </button>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-2 min-h-[4px]">
        <SortableContext items={sortedCards.map(c => `card-${c.id}`)} strategy={verticalListSortingStrategy}>
          {sortedCards.map(card => (
            <CardItem key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
        </SortableContext>
      </div>

      <AddCardForm columnId={column.id} onAdd={(t) => onAddCard(column.id, t)} />
    </section>
  );
}
