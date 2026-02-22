import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from '../../api/client';

interface Props {
  card: Card;
  onDelete: (id: number) => void;
}

export function CardItem({ card, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
    data: { type: 'card', card },
  });

  const style = {
    transform: CSS.Transform.toString(transform) + (hovered && !isDragging ? ' translateY(-1px)' : ''),
    transition: transition || 'box-shadow 0.15s ease, transform 0.15s ease',
    opacity: isDragging ? 0.4 : 1,
    boxShadow: isDragging
      ? 'none'
      : hovered
        ? '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 8px 20px -4px rgb(0 0 0 / 0.1)'
        : '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 4px 0 rgb(0 0 0 / 0.05)',
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      data-testid={`card-${card.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white dark:bg-gray-800 rounded-lg px-3.5 py-3 border border-slate-200 dark:border-gray-700 cursor-grab active:cursor-grabbing group"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-start gap-2">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1 leading-snug">{card.title}</span>
        <button
          data-testid={`card-delete-${card.id}`}
          aria-label={`Delete card ${card.title}`}
          onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 text-xs transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-0.5 flex-shrink-0"
        >
          ✕
        </button>
      </div>
      {card.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{card.description}</p>
      )}
    </article>
  );
}
