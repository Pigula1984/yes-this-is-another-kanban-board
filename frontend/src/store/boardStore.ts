import { create } from 'zustand';

interface BoardStore {
  selectedBoardId: number | null;
  setSelectedBoardId: (id: number | null) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  selectedBoardId: null,
  setSelectedBoardId: (id) => set({ selectedBoardId: id }),
}));
