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
    <div
      data-testid={`column-${column.id}`}
      className="bg-gray-100 rounded-xl p-3 w-72 flex-shrink-0 flex flex-col gap-3"
    >
      <div className="flex justify-between items-center">
        {isEditing ? (
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={e => { if (e.key === 'Enter') setIsEditing(false); }}
            className="text-sm font-semibold bg-white border border-gray-300 rounded px-2 py-0.5 flex-1"
          />
        ) : (
          <h3
            data-testid={`column-title-${column.id}`}
            className="text-sm font-semibold text-gray-700 flex-1 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {column.title} <span className="text-gray-400 font-normal">({cards.length})</span>
          </h3>
        )}
        <button
          data-testid={`column-delete-${column.id}`}
          onClick={() => onDeleteColumn(column.id)}
          className="text-gray-400 hover:text-red-500 text-xs ml-2 transition-colors"
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
    </div>
  );
}
