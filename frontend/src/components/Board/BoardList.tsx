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
    <div data-testid="board-list" className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">Kanban Board</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {boards.map(board => (
          <div
            key={board.id}
            data-testid={`board-item-${board.id}`}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              selectedBoardId === board.id ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
            onClick={() => setSelectedBoardId(board.id)}
          >
            <span className="text-sm truncate">{board.title}</span>
            <button
              data-testid={`board-delete-${board.id}`}
              onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(board.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 text-xs transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-700">
        {adding ? (
          <div className="space-y-2">
            <input
              data-testid="board-title-input"
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createMutation.mutate(newTitle); if (e.key === 'Escape') setAdding(false); }}
              placeholder="Board title"
              className="w-full text-sm bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                data-testid="create-board-submit"
                onClick={() => createMutation.mutate(newTitle)}
                className="flex-1 text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Create
              </button>
              <button onClick={() => setAdding(false)} className="text-sm text-gray-400 hover:text-gray-200">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            data-testid="new-board-btn"
            onClick={() => setAdding(true)}
            className="w-full text-sm text-gray-400 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors text-left"
          >
            + New board
          </button>
        )}
      </div>
    </div>
  );
}
