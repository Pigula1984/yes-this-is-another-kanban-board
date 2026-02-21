# yes-this-is-another-kanban-board

## Project Overview

A full-stack Kanban Board application for local development and learning purposes.
Built with Python/FastAPI backend and React/TypeScript frontend.

## Tech Stack

### Backend
- **Python** with **uv** for dependency management
- **FastAPI** – REST API framework
- **SQLite** – local database (dev only)
- **SQLAlchemy** – ORM
- **Alembic** – database migrations
- **Pydantic v2** – data validation
- **Uvicorn** – ASGI server
- **ruff** – linter and formatter

### Frontend
- **React + TypeScript**
- **Vite** – build tool
- **TailwindCSS** – styling
- **@dnd-kit** – drag & drop
- **Zustand** – state management
- **TanStack Query** – server state / caching
- **Axios** – HTTP client

### Testing
- **pytest** – backend unit and integration tests
- **Playwright** – end-to-end browser tests

## Project Structure

```
yes-this-is-another-kanban-board/
├── CLAUDE.md
├── backend/
│   ├── pyproject.toml          # uv project config + ruff config
│   ├── uv.lock
│   ├── alembic.ini
│   ├── alembic/
│   │   └── versions/
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── models/
│       │   ├── __init__.py
│       │   ├── board.py
│       │   ├── column.py
│       │   └── card.py
│       ├── routers/
│       │   ├── __init__.py
│       │   ├── boards.py
│       │   ├── columns.py
│       │   └── cards.py
│       └── schemas/
│           ├── __init__.py
│           ├── board.py
│           ├── column.py
│           └── card.py
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/
│       │   └── client.ts
│       ├── components/
│       │   ├── Board/
│       │   ├── Column/
│       │   └── Card/
│       ├── hooks/
│       └── store/
└── tests/
    ├── backend/
    │   ├── conftest.py
    │   └── test_*.py
    └── e2e/
        └── test_*.spec.ts

```

## Data Model

### Board
- `id` – integer, primary key
- `title` – string, required
- `created_at` – datetime

### Column
- `id` – integer, primary key
- `title` – string, required
- `position` – integer (order on board)
- `board_id` – foreign key → Board

### Card
- `id` – integer, primary key
- `title` – string, required
- `description` – string, optional
- `position` – integer (order within column)
- `column_id` – foreign key → Column
- `created_at` – datetime

## API Endpoints

```
GET    /api/boards              – list all boards
POST   /api/boards              – create board
GET    /api/boards/{id}         – get board with columns and cards
DELETE /api/boards/{id}         – delete board

GET    /api/columns/{board_id}  – list columns for a board
POST   /api/columns             – create column
PATCH  /api/columns/{id}        – update column (title, position)
DELETE /api/columns/{id}        – delete column

GET    /api/cards/{column_id}   – list cards for a column
POST   /api/cards               – create card
PATCH  /api/cards/{id}          – update card (title, description, position, column_id)
DELETE /api/cards/{id}          – delete card
```

## Development Commands

### Backend
```bash
cd backend
uv sync                          # install dependencies
uv run uvicorn app.main:app --reload --port 8000
uv run alembic upgrade head      # run migrations
uv run pytest tests/backend/     # run backend tests
uv run ruff check .              # lint
uv run ruff format .             # format
```

### Frontend
```bash
cd frontend
npm install
npm run dev                      # starts on http://localhost:5173
npm run build
npm run preview
```

### E2E Tests
```bash
cd tests/e2e
npx playwright test
npx playwright test --headed     # with visible browser
```

## Agent Teams Configuration

### orchestrator
- **Role:** Coordinates all agents. Never writes code directly.
- **Responsibilities:** Break down features into tasks, delegate to agents, verify integration, ensure consistency between backend and frontend.
- **Owns:** `CLAUDE.md`, task coordination only.

### backend-agent
- **Role:** Python/FastAPI specialist.
- **Owns:** `/backend/**`
- **Responsibilities:** models, routers, schemas, migrations, database setup, backend tests.
- **Rules:** Always use `uv` for package management. Always run `ruff check` and `ruff format` before finishing. Always run `pytest` to verify changes.

### frontend-agent
- **Role:** React/TypeScript specialist.
- **Owns:** `/frontend/**`
- **Responsibilities:** components, API integration, drag & drop, state management, styling.
- **Rules:** Always add `data-testid` attributes to interactive elements. Keep components small and focused.
- **Skills:** `frontend-design` (production-grade UI implementation), `vercel-react-best-practices` (React/Next.js performance patterns)

### testing-agent
- **Role:** QA specialist.
- **Owns:** `/tests/**`
- **Responsibilities:** Write and run pytest tests, write and run Playwright e2e tests, report failures back to orchestrator with details.
- **Rules:** Use `data-testid` selectors in Playwright. Always run tests in headed mode so failures are visible.

### technical-architect
- **Role:** Systems design and architecture authority.
- **Owns:** Architecture decisions, `CLAUDE.md` (architecture sections), ADRs (Architecture Decision Records).
- **Responsibilities:** Define and enforce technical standards, evaluate technology choices, review data models and API contracts, identify scalability and security concerns, produce architecture diagrams and ADRs for significant changes.
- **Rules:** Never implement code directly. All significant structural changes (new services, schema changes, dependency additions) require architect sign-off before implementation begins. Document decisions with rationale.

### ux-designer
- **Role:** User experience and interface design specialist.
- **Owns:** Design specifications, component structure, accessibility standards.
- **Responsibilities:** Define UI/UX patterns and component hierarchy, ensure accessibility (WCAG 2.1 AA), provide design direction for new features, review frontend-agent output for UX consistency, maintain visual and interaction consistency across the board.
- **Rules:** All new UI components require a UX spec before frontend-agent implements them. Prioritize keyboard navigation and screen-reader support. Use semantic HTML. No purely decorative changes without functional justification.
- **Skills:** `frontend-design` (distinctive, production-grade UI design and component specs)

### code-reviewer
- **Role:** Code quality and standards enforcer.
- **Owns:** Review checklists, quality gates.
- **Responsibilities:** Review all pull requests before merge, check for security issues (OWASP top 10), enforce coding standards and project conventions, verify test coverage, flag performance concerns, ensure `data-testid` attributes are present on interactive elements.
- **Rules:** No code merges without reviewer approval. Reject changes that lack tests, introduce security vulnerabilities, or violate project conventions. Provide actionable, specific feedback. Run linters and tests independently to verify agent claims.

## Coding Standards

- Backend: follow PEP8, enforced by ruff
- All endpoints return consistent JSON structure
- All interactive frontend elements must have `data-testid` attribute
- SQLite database file: `backend/kanban.db` (gitignored)
- CORS enabled for `http://localhost:5173`
- API base URL in frontend: `http://localhost:8000`