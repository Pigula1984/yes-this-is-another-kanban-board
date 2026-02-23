import { useState, useRef } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoard, createColumn, createCard, updateCard, deleteCard, deleteColumn } from '../../api/client';
import type { Card, Column } from '../../api/client';
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
  // dragColumns is only non-null during an active drag (optimistic UI)
  // When null, we render board.columns directly — no async delay on card/column mutations
  const [dragColumns, setDragColumns] = useState<Column[] | null>(null);
  const dragSourceRef = useRef<{ cardId: number; columnId: number } | null>(null);

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
    mutationFn: ({ columnId, title, assignee, dueDate }: { columnId: number; title: string; assignee?: string; dueDate?: string }) => {
      const col = board?.columns.find(c => c.id === columnId);
      const position = col?.cards.length ?? 0;
      return createCard({ title, position, column_id: columnId, assignee, due_date: dueDate });
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

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    if (!activeId.startsWith('card-')) return;
    const cardId = parseInt(activeId.replace('card-', ''));
    const overId = String(over.id);

    setDragColumns(prevCols => {
      if (!prevCols) return prevCols;
      const sourceColIndex = prevCols.findIndex(col => col.cards.some(c => c.id === cardId));
      if (sourceColIndex === -1) return prevCols;
      const sourceCol = prevCols[sourceColIndex];

      let targetColId: number;
      if (overId.startsWith('column-')) {
        targetColId = parseInt(overId.replace('column-', ''));
      } else if (overId.startsWith('card-')) {
        const overCardId = parseInt(overId.replace('card-', ''));
        const targetColIdx = prevCols.findIndex(col => col.cards.some(c => c.id === overCardId));
        if (targetColIdx === -1) return prevCols;
        targetColId = prevCols[targetColIdx].id;
      } else {
        return prevCols;
      }

      if (sourceCol.id === targetColId) return prevCols;

      const targetColIndex = prevCols.findIndex(c => c.id === targetColId);
      if (targetColIndex === -1) return prevCols;
      const targetCol = prevCols[targetColIndex];

      const movingCard = sourceCol.cards.find(c => c.id === cardId)!;
      const newSourceCards = sourceCol.cards.filter(c => c.id !== cardId);

      let insertIndex: number;
      if (overId.startsWith('card-')) {
        const overCardId = parseInt(overId.replace('card-', ''));
        const overIdx = targetCol.cards.findIndex(c => c.id === overCardId);
        insertIndex = overIdx >= 0 ? overIdx : targetCol.cards.length;
      } else {
        insertIndex = targetCol.cards.length;
      }

      const newTargetCards = [...targetCol.cards];
      newTargetCards.splice(insertIndex, 0, { ...movingCard, column_id: targetColId });

      return prevCols.map((col, idx) => {
        if (idx === sourceColIndex) return { ...col, cards: newSourceCards };
        if (idx === targetColIndex) return { ...col, cards: newTargetCards };
        return col;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    const activeId = String(active.id);
    if (!activeId.startsWith('card-')) {
      setDragColumns(null);
      dragSourceRef.current = null;
      return;
    }
    const cardId = parseInt(activeId.replace('card-', ''));

    if (!dragSourceRef.current || !board) {
      setDragColumns(null);
      dragSourceRef.current = null;
      return;
    }
    const { columnId: originalColumnId } = dragSourceRef.current;
    dragSourceRef.current = null;

    const currentCol = dragColumns?.find(col => col.cards.some(c => c.id === cardId));

    // Clear drag state before mutations so UI snaps back to server state on invalidate
    setDragColumns(null);

    if (!currentCol) return;

    if (currentCol.id !== originalColumnId) {
      // Cross-column: dragColumns already has correct position from onDragOver
      const newPosition = currentCol.cards.findIndex(c => c.id === cardId);
      updateCardMutation.mutate({ id: cardId, data: { column_id: currentCol.id, position: newPosition } });
    } else if (over) {
      // Same column: determine new position from drop target
      const overId = String(over.id);
      if (overId.startsWith('card-')) {
        const overCardId = parseInt(overId.replace('card-', ''));
        const cards = [...(board.columns.find(c => c.id === originalColumnId)?.cards ?? [])].sort((a, b) => a.position - b.position);
        const oldIndex = cards.findIndex(c => c.id === cardId);
        const newIndex = cards.findIndex(c => c.id === overCardId);
        if (oldIndex !== newIndex && oldIndex >= 0 && newIndex >= 0) {
          const reordered = arrayMove(cards, oldIndex, newIndex);
          reordered.forEach((card, idx) => {
            updateCardMutation.mutate({ id: card.id, data: { position: idx } });
          });
        }
      }
    }
  };

  if (isLoading) return <div className="p-8 text-sm text-gray-400 dark:text-gray-500">Loading board...</div>;
  if (!board) return <div className="p-8 text-sm text-red-500 dark:text-red-400">Board not found</div>;

  const displayColumns = dragColumns ?? [...board.columns].sort((a, b) => a.position - b.position);

  return (
    <div data-testid="board-view" className="flex-1 overflow-hidden flex flex-col">
      <div className="px-6 py-3.5 border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center">
        <h2 data-testid="board-title" className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{board.title}</h2>
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
            if (card) {
              setActiveCard(card);
              const sourceCol = board.columns.find(col => col.cards.some(c => c.id === cardId));
              if (sourceCol) {
                dragSourceRef.current = { cardId, columnId: sourceCol.id };
                // Initialize drag state from current board data
                setDragColumns([...board.columns].sort((a, b) => a.position - b.position));
              }
            }
          }
        }}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          dragSourceRef.current = null;
          setActiveCard(null);
          setDragColumns(null);
        }}
      >
        <div className="flex-1 overflow-x-auto px-6 py-5">
          <div className="flex gap-5 items-start min-h-full">
            {displayColumns.map(column => (
              <ColumnItem
                key={column.id}
                column={column}
                cards={column.cards}
                onAddCard={(colId, title, assignee, dueDate) => addCardMutation.mutate({ columnId: colId, title, assignee, dueDate })}
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
