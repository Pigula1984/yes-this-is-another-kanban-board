## Prompt

You are the **orchestrator** for the `yes-this-is-another-kanban-board` project.
Read `CLAUDE.md` carefully before doing anything.

Create an agent team to explore this from different angles. You are orchestrator, the rest of teammate is defined in the file CLAUDE.md.
All teammate use Sonnet.
You are orchestrator so you delegate all task, don't programming by yourself.

---

### Phase 1 – Project Scaffolding

Delegate to agents in parallel where possible:

**backend-agent tasks:**
1. Initialize uv project in `/backend`: `uv init`
2. Add dependencies: fastapi, uvicorn[standard], sqlalchemy, alembic, pydantic, aiosqlite
3. Add dev dependencies: pytest, pytest-asyncio, httpx, ruff
4. Create `pyproject.toml` with ruff config (line-length: 88, select: ["E", "F", "I"])
5. Create `app/database.py` with SQLite engine and session setup (file: `kanban.db`)
6. Create SQLAlchemy models: Board, Column, Card (as defined in CLAUDE.md)
7. Set up Alembic and run initial migration
8. Create Pydantic schemas for all models
9. Create FastAPI routers for boards, columns, and cards with all endpoints from CLAUDE.md
10. Create `app/main.py` – include all routers, configure CORS for `http://localhost:5173`
11. Run `ruff check` and `ruff format`, fix any issues
12. Start the backend server and confirm it's running on port 8000

**frontend-agent tasks:**
1. Scaffold Vite + React + TypeScript project in `/frontend`: `npm create vite@latest . -- --template react-ts`
2. Install dependencies: tailwindcss, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, zustand, @tanstack/react-query, axios
3. Configure TailwindCSS
4. Create API client in `src/api/client.ts` pointing to `http://localhost:8000`
5. Create Zustand store for board state
6. Create components: BoardList, Board, Column, Card – each with appropriate `data-testid` attributes
7. Implement drag & drop for cards between columns using @dnd-kit
8. Implement full CRUD for boards, columns, and cards
9. Style the UI with TailwindCSS – clean, functional Kanban layout

---

### Phase 2 – Testing

Once both backend and frontend are running, delegate to **testing-agent**:

1. Write pytest tests for all backend endpoints (create, read, update, delete for boards, columns, cards)
2. Write Playwright e2e tests:
   - Create a new board
   - Add three columns: "To Do", "In Progress", "Done"
   - Add cards to columns
   - Drag a card from "To Do" to "In Progress"
   - Verify card position persisted after page reload
3. Run all tests in headed mode (so failures are visible)
4. Report results back

---

### Phase 3 – Integration Verification

After all agents complete their work:
1. Confirm backend and frontend are running together without errors
2. Ask testing-agent to do a full e2e run
3. Summarize what was built, what tests pass, and any known limitations

---

### Important rules for all agents:
- Backend agent: always use `uv run` to execute Python commands
- Backend agent: run `ruff check` and `ruff format` after every significant change
- Frontend agent: every interactive element must have a `data-testid` attribute
- Testing agent: use `data-testid` selectors in all Playwright tests
- No agent writes outside their owned directory without orchestrator approval
- Commit after each phase: `git add . && git commit -m "phase X: description"`