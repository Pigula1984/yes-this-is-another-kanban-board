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
    <nav aria-label="Board navigation" data-testid="board-list" className="w-64 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col h-full">
      <div className="px-4 py-4 border-b border-slate-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
            </svg>
          </div>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Kanban</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {boards.map(board => (
          <div key={board.id} data-testid={`board-item-${board.id}`} className="relative" onClick={() => setSelectedBoardId(board.id)}>
            {selectedBoardId === board.id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />
            )}
            <div className={`group flex items-center justify-between pl-3 pr-2 py-1.5 rounded-lg cursor-pointer transition-colors duration-150 ${
              selectedBoardId === board.id
                ? 'bg-slate-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`}>
              <span className="text-sm truncate">{board.title}</span>
              <button
                data-testid={`board-delete-${board.id}`}
                aria-label={`Delete board ${board.title}`}
                onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(board.id); }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 text-xs transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-0.5"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-2 py-2 border-t border-slate-200 dark:border-gray-800">
        {adding ? (
          <div className="space-y-2 px-1">
            <input
              data-testid="board-title-input"
              aria-label="Board title"
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createMutation.mutate(newTitle); if (e.key === 'Escape') setAdding(false); }}
              placeholder="Board title"
              className="w-full text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-1.5 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <div className="flex gap-2">
              <button
                data-testid="create-board-submit"
                onClick={() => createMutation.mutate(newTitle)}
                className="flex-1 text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create
              </button>
              <button
                onClick={() => setAdding(false)}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
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
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New board
          </button>
        )}
      </div>
    </nav>
  );
}
