import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from '../../api/client';

interface Props {
  card: Card;
  onDelete: (id: number) => void;
}

export function CardItem({ card, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
    data: { type: 'card', card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      data-testid={`card-${card.id}`}
      className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm dark:shadow-md dark:shadow-black/20 border border-gray-200 dark:border-gray-600 cursor-grab active:cursor-grabbing group transition-colors duration-200"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-start gap-2">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1">{card.title}</span>
        <button
          data-testid={`card-delete-${card.id}`}
          aria-label={`Delete card ${card.title}`}
          onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 text-xs transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
        >
          ✕
        </button>
      </div>
      {card.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.description}</p>
      )}
    </article>
  );
}
