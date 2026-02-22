import { BoardList } from './components/Board/BoardList';
import { BoardView } from './components/Board/BoardView';
import { useBoardStore } from './store/boardStore';

function App() {
  const { selectedBoardId } = useBoardStore();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <BoardList />
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedBoardId ? (
          <BoardView boardId={selectedBoardId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-lg font-medium">Select or create a board to get started</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
