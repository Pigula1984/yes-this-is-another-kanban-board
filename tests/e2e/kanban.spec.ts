import { test, expect, Page } from '@playwright/test';

async function createBoard(page: Page, title: string): Promise<void> {
  await page.getByTestId('new-board-btn').click();
  await page.getByTestId('board-title-input').fill(title);
  await page.getByTestId('create-board-submit').click();
  await page.getByTestId('board-title').waitFor({ state: 'visible' });
}

async function addColumn(page: Page, title: string): Promise<void> {
  await page.getByTestId('add-column-btn').click();
  await page.getByTestId('column-title-input').fill(title);
  await page.getByTestId('add-column-submit').click();
  // Wait for the column to appear
  await page.locator(`[data-testid^="column-title-"]`).filter({ hasText: title }).waitFor({ state: 'visible' });
}

async function addCard(page: Page, title: string, columnSelector: string): Promise<void> {
  const column = page.locator(columnSelector);
  await column.getByTestId('add-card-btn').click();
  await column.getByTestId('card-title-input').fill(title);
  await column.getByTestId('add-card-submit').click();
  // Wait for the card to appear
  await page.locator(`[data-testid^="card-"]`).filter({ hasText: title }).waitFor({ state: 'visible' });
}

test.describe('Kanban Board E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clean up: delete all boards before each test via API
    const boards = await page.request.get('http://localhost:8000/api/boards');
    const boardList = await boards.json();
    for (const board of boardList) {
      await page.request.delete(`http://localhost:8000/api/boards/${board.id}`);
    }
    await page.reload();
  });

  test('creates a new board', async ({ page }) => {
    await page.getByTestId('new-board-btn').click();
    await page.getByTestId('board-title-input').fill('My First Board');
    await page.getByTestId('create-board-submit').click();

    // Board title should show in main area
    await expect(page.getByTestId('board-title')).toHaveText('My First Board');
    // Board should appear in sidebar
    await expect(page.locator('[data-testid^="board-item-"]')).toBeVisible();
  });

  test('adds three columns to a board', async ({ page }) => {
    await createBoard(page, 'Columns Test Board');

    await addColumn(page, 'To Do');
    await addColumn(page, 'In Progress');
    await addColumn(page, 'Done');

    // All three columns should be visible
    await expect(page.locator('[data-testid^="column-title-"]').filter({ hasText: 'To Do' })).toBeVisible();
    await expect(page.locator('[data-testid^="column-title-"]').filter({ hasText: 'In Progress' })).toBeVisible();
    await expect(page.locator('[data-testid^="column-title-"]').filter({ hasText: 'Done' })).toBeVisible();
  });

  test('adds cards to columns', async ({ page }) => {
    await createBoard(page, 'Cards Test Board');
    await addColumn(page, 'Backlog');

    // Find the first column container
    const columnContainer = page.locator('[data-testid^="column-"]').filter({ hasText: 'Backlog' }).first();

    await addCard(page, 'First Task', `[data-testid^="column-"]:has([data-testid^="column-title-"]:text("Backlog"))`);
    await addCard(page, 'Second Task', `[data-testid^="column-"]:has([data-testid^="column-title-"]:text("Backlog"))`);

    // Both cards should be visible
    await expect(page.locator('[data-testid^="card-"]').filter({ hasText: 'First Task' })).toBeVisible();
    await expect(page.locator('[data-testid^="card-"]').filter({ hasText: 'Second Task' })).toBeVisible();
  });

  test('drag a card from one column to another', async ({ page }) => {
    await createBoard(page, 'Drag Test Board');
    await addColumn(page, 'To Do');
    await addColumn(page, 'In Progress');

    // Add a card to "To Do"
    await addCard(page, 'Test Card', `[data-testid^="column-"]:has([data-testid^="column-title-"]:text("To Do"))`);

    // Verify card is in "To Do"
    const toDoColumn = page.locator('[data-testid^="column-"]').filter({ has: page.locator('[data-testid^="column-title-"]').filter({ hasText: 'To Do' }) });
    await expect(toDoColumn.locator('[data-testid^="card-"]').filter({ hasText: 'Test Card' })).toBeVisible();

    // Get bounding boxes for drag
    const cardEl = toDoColumn.locator('[data-testid^="card-"]').filter({ hasText: 'Test Card' });
    const inProgressColumn = page.locator('[data-testid^="column-"]').filter({ has: page.locator('[data-testid^="column-title-"]').filter({ hasText: 'In Progress' }) });

    const cardBox = await cardEl.boundingBox();
    const targetBox = await inProgressColumn.boundingBox();

    if (cardBox && targetBox) {
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      // Move slowly to trigger dnd-kit pointer sensor
      await page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2,
        { steps: 20 }
      );
      await page.mouse.up();
    }

    // Wait for UI to update
    await page.waitForTimeout(1000);

    // Card should now be in "In Progress"
    await expect(inProgressColumn.locator('[data-testid^="card-"]').filter({ hasText: 'Test Card' })).toBeVisible();
  });

  test('card position persists after page reload', async ({ page }) => {
    await createBoard(page, 'Persist Test Board');
    await addColumn(page, 'To Do');
    await addColumn(page, 'Done');

    // Add a card to "To Do"
    await addCard(page, 'Persistent Card', `[data-testid^="column-"]:has([data-testid^="column-title-"]:text("To Do"))`);

    // Use the API directly to move the card to "Done" column
    // First, get the board state
    const boardsResp = await page.request.get('http://localhost:8000/api/boards');
    const boardList = await boardsResp.json();
    const board = boardList[0];

    // Find the "Done" column and the card
    const boardDetailResp = await page.request.get(`http://localhost:8000/api/boards/${board.id}`);
    const boardDetail = await boardDetailResp.json();
    const doneColumn = boardDetail.columns.find((c: { title: string }) => c.title === 'Done');
    const toDoColumn = boardDetail.columns.find((c: { title: string }) => c.title === 'To Do');
    const card = toDoColumn.cards[0];

    // Move card to Done via API
    await page.request.patch(`http://localhost:8000/api/cards/${card.id}`, {
      data: { column_id: doneColumn.id, position: 0 },
    });

    // Reload page
    await page.reload();

    // Wait for board to load
    await page.waitForSelector('[data-testid^="column-"]');

    // Card should be in "Done" column
    const doneColumnEl = page.locator('[data-testid^="column-"]').filter({ has: page.locator('[data-testid^="column-title-"]').filter({ hasText: 'Done' }) });
    await expect(doneColumnEl.locator('[data-testid^="card-"]').filter({ hasText: 'Persistent Card' })).toBeVisible();
  });
});
