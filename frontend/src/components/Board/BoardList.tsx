import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoards, createBoard, deleteBoard } from '../../api/client';
import { useBoardStore } from '../../store/boardStore';

export function BoardList() {
  const queryClient = useQueryClient();
  const { selectedBoardId, setSelectedBoardId } = useBoardStore();
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const { data: boards = [] } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  });

  const createMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setSelectedBoardId(board.id);
      setAdding(false);
      setNewTitle('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setSelectedBoardId(null);
    },
  });

  return (
    <nav aria-label="Board navigation" data-testid="board-list" className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex flex-col h-full transition-colors duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-bold">Kanban Board</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {boards.map(board => (
          <div
            key={board.id}
            data-testid={`board-item-${board.id}`}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150 ${
              selectedBoardId === board.id
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setSelectedBoardId(board.id)}
          >
            <span className="text-sm truncate">{board.title}</span>
            <button
              data-testid={`board-delete-${board.id}`}
              aria-label={`Delete board ${board.title}`}
              onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(board.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 text-xs transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        {adding ? (
          <div className="space-y-2">
            <input
              data-testid="board-title-input"
              aria-label="Board title"
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createMutation.mutate(newTitle); if (e.key === 'Escape') setAdding(false); }}
              placeholder="Board title"
              className="w-full text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-150"
            />
            <div className="flex gap-2">
              <button
                data-testid="create-board-submit"
                onClick={() => createMutation.mutate(newTitle)}
                className="flex-1 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Create
              </button>
              <button
                onClick={() => setAdding(false)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            data-testid="new-board-btn"
            aria-label="Create new board"
            onClick={() => setAdding(true)}
            className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors duration-150 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            + New board
          </button>
        )}
      </div>
    </nav>
  );
}
