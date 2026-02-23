# Yes, This Is Another Kanban Board

A full-stack Kanban board application built with Python/FastAPI and React/TypeScript. This is a learning project designed for local development, featuring a clean separation between backend and frontend with drag-and-drop functionality powered by dnd-kit.

## Features

- **Create Boards** — Organize your work across multiple independent boards
- **Manage Columns** — Add columns to structure work stages (To Do, In Progress, Done, etc.)
- **Create and Edit Cards** — Add tasks with titles, optional descriptions, assignees, and due dates
- **Card Metadata** — Assign tasks to team members and track due dates with overdue highlighting
- **Drag and Drop** — Move cards between columns and reorder them within columns using pointer-based drag detection with reliable alignment
- **Real-time Persistence** — All changes are persisted to SQLite database
- **Board Selection** — Sidebar navigation to quickly switch between boards
- **Delete Operations** — Remove boards, columns, and cards with confirmation
- **Dark Mode** — Toggle between light and dark themes with persistent preference
- **Modern Design** — Clean, professional SaaS-style interface inspired by Linear, Vercel, and Notion

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.14+** | Programming language |
| **FastAPI** | REST API framework |
| **SQLAlchemy 2.0** | ORM for database abstraction |
| **Pydantic v2** | Data validation and serialization |
| **SQLite** | Local persistent database (development only) |
| **Alembic** | Database schema migrations |
| **Uvicorn** | ASGI web server |
| **uv** | Python dependency and project management |
| **ruff** | Linter and code formatter |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool and dev server |
| **TailwindCSS v4** | Utility-first CSS framework with custom design tokens |
| **@dnd-kit** | Drag-and-drop library (core, sortable, utilities) |
| **Zustand** | Lightweight state management |
| **TanStack Query** | Server state management and caching |
| **Axios** | HTTP client for API calls |
| **lucide-react** | Icon library for UI components |

### Testing
| Technology | Purpose |
|---|---|
| **pytest** | Python unit and integration testing |
| **Playwright** | End-to-end browser testing |
| **FastAPI TestClient** | API endpoint testing |

## Project Structure

```
yes-this-is-another-kanban-board/
├── README.md                         # Project documentation
├── CLAUDE.md                         # Development team configuration and standards
├── pyproject.toml                    # Root ruff configuration
├── backend/
│   ├── pyproject.toml                # Backend dependencies and uv config
│   ├── uv.lock                       # Locked dependency versions
│   ├── alembic.ini                   # Database migration configuration
│   ├── alembic/
│   │   └── versions/                 # Database migration scripts
│   ├── kanban.db                     # SQLite database (gitignored)
│   └── app/
│       ├── main.py                   # FastAPI application and CORS setup
│       ├── database.py               # SQLAlchemy engine and session factory
│       ├── models/                   # SQLAlchemy ORM models
│       │   ├── board.py              # Board model with relationships
│       │   ├── column.py             # Column model with board and card relationships
│       │   └── card.py               # Card model with column relationship
│       ├── routers/                  # FastAPI route handlers
│       │   ├── boards.py             # Board CRUD endpoints
│       │   ├── columns.py            # Column CRUD endpoints
│       │   └── cards.py              # Card CRUD endpoints
│       └── schemas/                  # Pydantic validation schemas
│           ├── board.py              # Board request/response schemas
│           ├── column.py             # Column request/response schemas
│           └── card.py               # Card request/response schemas
├── frontend/
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.ts                # Vite build configuration
│   ├── tailwind.config.ts            # TailwindCSS configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── index.html                    # HTML entry point
│   └── src/
│       ├── main.tsx                  # React app entry point
│       ├── App.tsx                   # Root component (board list + board view)
│       ├── api/
│       │   └── client.ts             # Axios API client with TypeScript interfaces
│       ├── components/
│       │   ├── Board/
│       │   │   ├── BoardList.tsx      # Sidebar board selector and creation
│       │   │   └── BoardView.tsx      # Main board display with drag-drop
│       │   ├── Column/
│       │   │   ├── ColumnItem.tsx     # Column container with cards
│       │   │   └── AddColumnForm.tsx  # Column creation form
│       │   ├── Card/
│       │   │   ├── CardItem.tsx       # Card display component
│       │   │   └── AddCardForm.tsx    # Card creation form
│       │   └── ThemeToggle.tsx        # Light/dark mode toggle component
│       ├── hooks/                    # Custom React hooks
│       └── store/
│           └── boardStore.ts         # Zustand store for selected board state
└── tests/
    ├── backend/
    │   ├── conftest.py               # pytest fixtures for test database and client
    │   ├── test_boards.py            # Board endpoint tests
    │   ├── test_columns.py           # Column endpoint tests
    │   └── test_cards.py             # Card endpoint tests
    └── e2e/
        ├── kanban.spec.ts            # Playwright end-to-end tests
        ├── playwright.config.ts       # Playwright test configuration
        └── package.json              # E2E test dependencies
```

## Prerequisites

Before running the application, ensure you have the following installed:

- **Python 3.14 or higher** — Required for the FastAPI backend
  - Download from [python.org](https://www.python.org)
  - Verify installation: `python --version`

- **uv** — Python project and dependency manager (much faster than pip)
  - Installation: `curl -LsSf https://astral.sh/uv/install.sh | sh` (macOS/Linux) or `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"` (Windows)
  - Verify installation: `uv --version`

- **Node.js 18+ and npm** — Required for the React frontend
  - Download from [nodejs.org](https://nodejs.org)
  - Verify installation: `node --version && npm --version`

- **Git** — For cloning the repository
  - Download from [git-scm.com](https://git-scm.com)
  - Verify installation: `git --version`

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/yes-this-is-another-kanban-board.git
cd yes-this-is-another-kanban-board
```

### 2. Set Up and Start the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install dependencies using uv:

```bash
uv sync
```

This command reads `pyproject.toml` and `uv.lock` to install all backend dependencies, including development tools.

Initialize the database with Alembic migrations:

```bash
uv run alembic upgrade head
```

This creates the SQLite database (`kanban.db`) with the required schema.

Start the FastAPI development server:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. The `--reload` flag watches for code changes and automatically restarts the server.

To verify the API is running, visit `http://localhost:8000/docs` to see the interactive Swagger documentation.

### 3. Set Up and Start the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies using npm:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will typically start on `http://localhost:5173`. Check the terminal output for the exact URL.

The frontend is configured to communicate with the backend at `http://localhost:8000/api`.

### 4. Open the Application

Open your web browser and navigate to `http://localhost:5173`.

You should see:
- A dark sidebar on the left (Kanban Board header)
- A "+ New board" button to create your first board
- An empty main area with a message to select or create a board

### Quick Start Summary

Terminal 1 (Backend):
```bash
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Card Features and Metadata

Cards now support rich metadata to help teams track and organize work more effectively:

### Assignees
- Assign cards to team members by entering their name
- Assignee information is displayed on each card with a user icon
- Useful for tracking who is responsible for each task

### Due Dates
- Set optional due dates for cards to track deadlines
- Due dates are displayed with a calendar icon on the card
- Cards with due dates in the past are highlighted in red with an "Overdue" label
- Helps prioritize work and maintain accountability

### Visual Feedback
- Overdue cards display a red left border and red text for high visibility
- Hover effects elevate cards to show interactivity
- Dark mode support for comfortable viewing in low-light environments

## Design System

The frontend follows a modern SaaS aesthetic with a professional, minimal design system:

**Typography:**
- Inter font family for all text (clean, modern, professional)

**Color Palette:**
- Blue accent color for primary actions and highlights
- Light mode: Clean white backgrounds with subtle gray borders
- Dark mode: Dark gray backgrounds with lighter text for reduced eye strain

**Visual Tokens:**
- Custom shadow tokens for depth and layering (used for cards, modals, popovers)
- Consistent spacing and padding throughout

**Theme Toggle:**
- Users can switch between light and dark modes via the `ThemeToggle` component
- Theme preference is stored in local storage and persists across sessions
- Dark mode uses a sophisticated color palette inspired by professional tools (Linear, Vercel, Notion)

## API Reference

The API is RESTful and returns JSON responses. The base URL is `http://localhost:8000/api`.

### Common Response Structure

All successful responses return the requested data in JSON format. Error responses include a `detail` field with the error message.

**Status Codes:**
- `200` — OK (successful GET, PATCH)
- `201` — Created (successful POST)
- `204` — No Content (successful DELETE)
- `404` — Not Found (resource does not exist)
- `422` — Unprocessable Entity (validation error)

### Boards

#### List All Boards

```
GET /boards
```

Returns an array of all boards with their nested columns and cards.

**Response:**
```json
[
  {
    "id": 1,
    "title": "My Board",
    "created_at": "2025-02-21T10:30:00Z",
    "columns": [
      {
        "id": 1,
        "title": "To Do",
        "position": 0,
        "board_id": 1,
        "cards": []
      }
    ]
  }
]
```

#### Create a Board

```
POST /boards
```

Creates a new board with the given title.

**Request Body:**
```json
{
  "title": "My First Board"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "My First Board",
  "created_at": "2025-02-21T10:30:00Z",
  "columns": []
}
```

#### Get Board by ID

```
GET /boards/{board_id}
```

Returns a specific board with all its columns and nested cards.

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "My Board",
  "created_at": "2025-02-21T10:30:00Z",
  "columns": [
    {
      "id": 1,
      "title": "To Do",
      "position": 0,
      "board_id": 1,
      "cards": [
        {
          "id": 1,
          "title": "Task 1",
          "description": "Do something",
          "position": 0,
          "column_id": 1,
          "due_date": "2025-03-15T00:00:00",
          "assignee": "Alice",
          "created_at": "2025-02-21T10:31:00Z"
        }
      ]
    }
  ]
}
```

#### Delete a Board

```
DELETE /boards/{board_id}
```

Deletes a board and all its columns and cards (cascade delete).

**Response:** `204 No Content` (empty body)

### Columns

#### List Columns for a Board

```
GET /columns/{board_id}
```

Returns all columns for the specified board.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "To Do",
    "position": 0,
    "board_id": 1,
    "cards": []
  },
  {
    "id": 2,
    "title": "In Progress",
    "position": 1,
    "board_id": 1,
    "cards": []
  }
]
```

#### Create a Column

```
POST /columns
```

Creates a new column on a board.

**Request Body:**
```json
{
  "title": "To Do",
  "position": 0,
  "board_id": 1
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "To Do",
  "position": 0,
  "board_id": 1,
  "cards": []
}
```

#### Update a Column

```
PATCH /columns/{column_id}
```

Updates a column's title and/or position. All fields are optional.

**Request Body:**
```json
{
  "title": "To Do",
  "position": 1
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "To Do",
  "position": 1,
  "board_id": 1,
  "cards": []
}
```

#### Delete a Column

```
DELETE /columns/{column_id}
```

Deletes a column and all its cards (cascade delete).

**Response:** `204 No Content` (empty body)

### Cards

#### List Cards in a Column

```
GET /cards/{column_id}
```

Returns all cards in the specified column.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Task 1",
    "description": "Do something",
    "position": 0,
    "column_id": 1,
    "due_date": "2025-03-15T00:00:00",
    "assignee": "Alice",
    "created_at": "2025-02-21T10:31:00Z"
  }
]
```

#### Create a Card

```
POST /cards
```

Creates a new card in a column.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task details (optional)",
  "position": 0,
  "column_id": 1,
  "due_date": "2025-03-15",
  "assignee": "Alice"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "New Task",
  "description": "Task details",
  "position": 0,
  "column_id": 1,
  "due_date": "2025-03-15T00:00:00",
  "assignee": "Alice",
  "created_at": "2025-02-21T10:31:00Z"
}
```

#### Update a Card

```
PATCH /cards/{card_id}
```

Updates a card's properties. All fields are optional. Use this endpoint to move cards between columns, change their position, update assignees, or modify due dates.

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "position": 2,
  "column_id": 2,
  "due_date": "2025-03-20",
  "assignee": "Bob"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated Task",
  "description": "Updated description",
  "position": 2,
  "column_id": 2,
  "due_date": "2025-03-20T00:00:00",
  "assignee": "Bob",
  "created_at": "2025-02-21T10:31:00Z"
}
```

#### Delete a Card

```
DELETE /cards/{card_id}
```

Deletes a card.

**Response:** `204 No Content` (empty body)

## Data Model

The application uses three core entities with the following relationships:

### Board

A container for columns and cards. Represents a complete Kanban board project.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Auto-increment | Unique board identifier |
| `title` | String | Required | Name of the board (e.g., "Sprint 1", "Q1 Goals") |
| `created_at` | DateTime | Default: UTC now | Timestamp when board was created |

**Relationships:**
- One-to-Many with Column (cascade delete: when a board is deleted, all columns are deleted)

### Column

A vertical section within a board, typically representing a workflow stage.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Auto-increment | Unique column identifier |
| `title` | String | Required | Name of the column (e.g., "To Do", "Done") |
| `position` | Integer | Required | Display order within the board (0-indexed) |
| `board_id` | Integer | Foreign Key → Board | Reference to parent board |

**Relationships:**
- Many-to-One with Board
- One-to-Many with Card (cascade delete: when a column is deleted, all cards are deleted)

### Card

A task or item within a column.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Auto-increment | Unique card identifier |
| `title` | String | Required | Task name or title |
| `description` | String | Optional (nullable) | Detailed description or notes |
| `position` | Integer | Required | Display order within the column (0-indexed) |
| `column_id` | Integer | Foreign Key → Column | Reference to parent column |
| `due_date` | DateTime | Optional (nullable) | When the task is due; used for deadline tracking and overdue highlighting |
| `assignee` | String | Optional (nullable) | Name or identifier of the person assigned to the task |
| `created_at` | DateTime | Default: UTC now | Timestamp when card was created |

**Relationships:**
- Many-to-One with Column

### Entity-Relationship Diagram

```
Board (1) ──────── (0..N) Column
  - id                - id
  - title             - title
  - created_at        - position
                      - board_id

Column (1) ──────── (0..N) Card
  - id                - id
  - title             - title
  - position          - description
  - board_id          - position
                      - column_id
                      - created_at
```

## Recent Improvements

### Drag-and-Drop Reliability
The drag-and-drop system has been improved to ensure proper CSS transform concatenation during card movement. This fixes alignment issues that occurred when dragging cards between columns, particularly when combining hover effects with drag transforms. Cards now maintain proper alignment throughout the drag operation and during visual feedback interactions.

## Running Tests

### Backend Tests with pytest

Backend tests verify API endpoints and database operations.

**Run all backend tests:**
```bash
cd backend
uv run pytest tests/backend/
```

**Run a specific test file:**
```bash
uv run pytest tests/backend/test_boards.py
```

**Run a specific test:**
```bash
uv run pytest tests/backend/test_boards.py::test_create_board
```

**Run with verbose output:**
```bash
uv run pytest tests/backend/ -v
```

**Run with coverage report:**
```bash
uv run pytest tests/backend/ --cov=app
```

**Test Structure:**
- `conftest.py` — Pytest fixtures for test database and API client
- `test_boards.py` — Board CRUD operation tests
- `test_columns.py` — Column CRUD operation tests
- `test_cards.py` — Card CRUD operation tests

Each test uses an isolated SQLite database (`test_kanban.db`) that is created and destroyed for each test.

### Frontend E2E Tests with Playwright

End-to-end tests verify the complete user workflows in a real browser.

**Prerequisites:**
Navigate to the E2E tests directory:
```bash
cd tests/e2e
npm install
```

**Run all tests:**
```bash
npx playwright test
```

**Run tests with visible browser (headed mode):**
```bash
npx playwright test --headed
```

**Run a specific test:**
```bash
npx playwright test kanban.spec.ts --headed
```

**Run tests in debug mode:**
```bash
npx playwright test --debug
```

**View test report:**
```bash
npx playwright show-report
```

**Test Coverage:**
The `kanban.spec.ts` file includes tests for:
- Creating a new board
- Adding multiple columns
- Adding cards to columns
- Dragging cards between columns
- Verifying card position persistence after page reload
- Card alignment during cross-column drag operations
- Due date and assignee field CRUD operations

**Note:** E2E tests require both the backend (`http://localhost:8000`) and frontend (`http://localhost:5173`) to be running.

## Development

### Code Quality and Formatting

#### Backend Linting and Formatting

The backend uses `ruff` for code quality checks and automatic formatting.

**Check code style (lint):**
```bash
cd backend
uv run ruff check .
```

**Auto-format code:**
```bash
uv run ruff format .
```

**Fix linting issues automatically:**
```bash
uv run ruff check . --fix
```

Ruff is configured in `pyproject.toml` with:
- Line length: 88 characters
- Selected rules: E (error), F (pyflakes), I (imports)

#### Frontend Linting

```bash
cd frontend
npm run lint
```

### Database Migrations

Database schema changes use Alembic for version control.

**Create a new migration:**
```bash
cd backend
uv run alembic revision --autogenerate -m "Description of changes"
```

This generates a new migration file in `alembic/versions/` that you should review before applying.

**Apply pending migrations:**
```bash
uv run alembic upgrade head
```

**Revert to a previous migration:**
```bash
uv run alembic downgrade <revision_id>
```

**View migration history:**
```bash
uv run alembic history
```

### Development Workflow

**Terminal 1 — Backend with Hot Reload:**
```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

The `--reload` flag automatically restarts the server when Python files change.

**Terminal 2 — Frontend with Hot Reload:**
```bash
cd frontend
npm run dev
```

Vite automatically refreshes the browser when React components or CSS change.

**Terminal 3 — Run Tests (as needed):**
```bash
# Backend tests
cd backend
uv run pytest tests/backend/ --watch

# Or E2E tests
cd tests/e2e
npx playwright test --watch
```

### Build for Production

**Backend:** The backend is designed for development with Uvicorn. For production, use a WSGI/ASGI server like Gunicorn or deploy to a platform like Heroku, Railway, or Vercel.

**Frontend:**
```bash
cd frontend
npm run build
```

This creates a `dist/` directory with optimized, minified static assets ready for deployment.

## Known Limitations

- **SQLite Database Only** — The application uses SQLite, which is not suitable for production or multi-user concurrent access. For production use, migrate to PostgreSQL, MySQL, or another enterprise database.

- **No Authentication** — The application has no user authentication or authorization. All data is public and shared across all users.

- **No Data Validation on Drag/Drop** — Card positions are updated optimistically without server-side validation of the operation order.

- **No Real-time Synchronization** — Changes made by other users/clients are not pushed in real-time. Users must reload to see updates made by others.

- **Limited Error Handling** — Frontend error states are basic and may not handle all edge cases gracefully.

- **No Search or Filter** — There is no way to search for boards or cards, or filter by status.

- **Limited User Preferences** — Theme preference is persisted, but other settings like column order preferences or default board are not saved.

- **CORS Restricted** — CORS is hardcoded to allow only `http://localhost:5173`. This must be updated for other deployment scenarios.

- **Fixed API Base URL** — The frontend API base URL is hardcoded in `frontend/src/api/client.ts` as `http://localhost:8000/api`. This requires code changes to point to a different backend.

- **Development Mode Only** — SQLite file is stored in `backend/kanban.db` with no backup strategy. Never use this setup for important data.

## Contributing

This is a learning project. Feel free to fork, modify, and experiment. Follow the coding standards outlined in `CLAUDE.md`.

## License

This project is provided as-is for educational purposes.

---

**Need Help?**

- Check the API documentation at `http://localhost:8000/docs` (when backend is running)
- Review the test files for usage examples
- Refer to the technical stack documentation for specific library features
