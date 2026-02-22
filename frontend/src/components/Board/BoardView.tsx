import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoard, createColumn, createCard, updateCard, deleteCard, deleteColumn } from '../../api/client';
import type { Card } from '../../api/client';
import { ColumnItem } from '../Column/ColumnItem';
import { AddColumnForm } from '../Column/AddColumnForm';
import { CardItem } from '../Card/CardItem';
import { ThemeToggle } from '../ThemeToggle';

interface Props {
  boardId: number;
  isDark: boolean;
  toggleTheme: () => void;
}

export function BoardView({ boardId, isDark, toggleTheme }: Props) {
  const queryClient = useQueryClient();
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const { data: board, isLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoard(boardId),
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const addColumnMutation = useMutation({
    mutationFn: (title: string) => createColumn({
      title,
      position: (board?.columns.length ?? 0),
      board_id: boardId,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  });

  const addCardMutation = useMutation({
    mutationFn: ({ columnId, title }: { columnId: number; title: string }) => {
      const col = board?.columns.find(c => c.id === columnId);
      const position = col?.cards.length ?? 0;
      return createCard({ title, position, column_id: columnId });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { position?: number; column_id?: number } }) =>
      updateCard(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  });

  const deleteColumnMutation = useMutation({
    mutationFn: deleteColumn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over || !board) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (!activeId.startsWith('card-')) return;

    const cardId = parseInt(activeId.replace('card-', ''));

    // Find source column
    const sourceColumn = board.columns.find(col => col.cards.some(c => c.id === cardId));
    if (!sourceColumn) return;

    // Determine target column
    let targetColumnId: number;
    if (overId.startsWith('column-')) {
      targetColumnId = parseInt(overId.replace('column-', ''));
    } else if (overId.startsWith('card-')) {
      const targetCardId = parseInt(overId.replace('card-', ''));
      const targetCol = board.columns.find(col => col.cards.some(c => c.id === targetCardId));
      targetColumnId = targetCol?.id ?? sourceColumn.id;
    } else {
      return;
    }

    const targetColumn = board.columns.find(c => c.id === targetColumnId);
    if (!targetColumn) return;

    if (sourceColumn.id === targetColumnId) {
      // Reorder within same column
      const cards = [...sourceColumn.cards].sort((a, b) => a.position - b.position);
      const oldIndex = cards.findIndex(c => c.id === cardId);
      let newIndex = oldIndex;
      if (overId.startsWith('card-')) {
        const overCardId = parseInt(overId.replace('card-', ''));
        newIndex = cards.findIndex(c => c.id === overCardId);
      }
      if (oldIndex !== newIndex) {
        const reordered = arrayMove(cards, oldIndex, newIndex);
        reordered.forEach((card, idx) => {
          updateCardMutation.mutate({ id: card.id, data: { position: idx } });
        });
      }
    } else {
      // Move to different column
      const targetCards = [...targetColumn.cards].sort((a, b) => a.position - b.position);
      const newPosition = targetCards.length;
      updateCardMutation.mutate({ id: cardId, data: { column_id: targetColumnId, position: newPosition } });
    }
  };

  if (isLoading) return <div className="p-8 text-gray-500 dark:text-gray-400">Loading board...</div>;
  if (!board) return <div className="p-8 text-red-500 dark:text-red-400">Board not found</div>;

  const sortedColumns = [...board.columns].sort((a, b) => a.position - b.position);

  return (
    <div data-testid="board-view" className="flex-1 overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center transition-colors duration-200">
        <h2 data-testid="board-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">{board.title}</h2>
        <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(e) => {
          const activeId = String(e.active.id);
          if (activeId.startsWith('card-')) {
            const cardId = parseInt(activeId.replace('card-', ''));
            const card = board.columns.flatMap(c => c.cards).find(c => c.id === cardId);
            if (card) setActiveCard(card);
          }
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-4 items-start min-h-full">
            {sortedColumns.map(column => (
              <ColumnItem
                key={column.id}
                column={column}
                cards={column.cards}
                onAddCard={(colId, title) => addCardMutation.mutate({ columnId: colId, title })}
                onDeleteCard={(cardId) => deleteCardMutation.mutate(cardId)}
                onDeleteColumn={(colId) => deleteColumnMutation.mutate(colId)}
              />
            ))}
            <AddColumnForm onAdd={(title) => addColumnMutation.mutate(title)} />
          </div>
        </div>
        <DragOverlay>
          {activeCard && <CardItem card={activeCard} onDelete={() => {}} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
