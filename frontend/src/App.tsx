import { BoardList } from './components/Board/BoardList';
import { BoardView } from './components/Board/BoardView';
import { ThemeToggle } from './components/ThemeToggle';
import { useBoardStore } from './store/boardStore';
import { useTheme } from './hooks/useTheme';

function App() {
  const { selectedBoardId } = useBoardStore();
  const { isDark, toggle } = useTheme();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      <BoardList />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {selectedBoardId ? (
          <BoardView boardId={selectedBoardId} isDark={isDark} toggleTheme={toggle} />
        ) : (
          <>
            <div className="absolute top-4 right-4 z-10">
              <ThemeToggle isDark={isDark} toggle={toggle} />
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-lg font-medium">Select or create a board to get started</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
