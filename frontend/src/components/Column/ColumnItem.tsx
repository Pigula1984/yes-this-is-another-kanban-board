import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Column, Card } from '../../api/client';
import { CardItem } from '../Card/CardItem';
import { AddCardForm } from '../Card/AddCardForm';

interface Props {
  column: Column;
  cards: Card[];
  onAddCard: (columnId: number, title: string, assignee?: string, dueDate?: string) => void;
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
      className="bg-[#EBEBEB] dark:bg-gray-800/60 rounded-xl px-3 pt-3 pb-2 w-72 flex-shrink-0 flex flex-col gap-2 border border-slate-200/60 dark:border-gray-700/50"
    >
      <div className="flex justify-between items-center px-0.5 mb-1">
        {isEditing ? (
          <input
            autoFocus
            aria-label="Column title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={e => { if (e.key === 'Enter') setIsEditing(false); }}
            className="text-xs font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-slate-300 dark:border-gray-600 rounded-md px-2 py-0.5 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-wide"
          />
        ) : (
          <h3
            data-testid={`column-title-${column.id}`}
            className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide flex-1 cursor-pointer flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            {column.title}
            <span className="text-gray-400 dark:text-gray-500 font-normal normal-case tracking-normal text-xs">({cards.length})</span>
          </h3>
        )}
        <button
          data-testid={`column-delete-${column.id}`}
          aria-label={`Delete column ${column.title}`}
          onClick={() => onDeleteColumn(column.id)}
          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 text-xs ml-2 p-0.5 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ✕
        </button>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-2 min-h-[8px]">
        <SortableContext items={sortedCards.map(c => `card-${c.id}`)} strategy={verticalListSortingStrategy}>
          {sortedCards.map(card => (
            <CardItem key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
        </SortableContext>
      </div>

      <AddCardForm columnId={column.id} onAdd={(t, assignee, dueDate) => onAddCard(column.id, t, assignee, dueDate)} />
    </section>
  );
}
