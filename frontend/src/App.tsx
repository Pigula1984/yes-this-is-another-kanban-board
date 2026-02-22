import { BoardList } from './components/Board/BoardList';
import { BoardView } from './components/Board/BoardView';
import { ThemeToggle } from './components/ThemeToggle';
import { useBoardStore } from './store/boardStore';
import { useTheme } from './hooks/useTheme';

function App() {
  const { selectedBoardId } = useBoardStore();
  const { isDark, toggle } = useTheme();

  return (
    <div className="flex h-screen bg-[#F4F4F5] dark:bg-gray-950 overflow-hidden">
      <BoardList />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {selectedBoardId ? (
          <BoardView boardId={selectedBoardId} isDark={isDark} toggleTheme={toggle} />
        ) : (
          <>
            <div className="absolute top-4 right-4 z-10">
              <ThemeToggle isDark={isDark} toggle={toggle} />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center shadow-sm text-2xl">
                  📋
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Select or create a board to get started</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
