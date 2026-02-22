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
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`card-${card.id}`}
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing group"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-start gap-2">
        <span className="text-sm font-medium text-gray-800 flex-1">{card.title}</span>
        <button
          data-testid={`card-delete-${card.id}`}
          onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs transition-opacity"
        >
          ✕
        </button>
      </div>
      {card.description && (
        <p className="text-xs text-gray-500 mt-1">{card.description}</p>
      )}
    </div>
  );
}
