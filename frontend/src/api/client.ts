import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export interface Board {
  id: number;
  title: string;
  created_at: string;
  columns: Column[];
}

export interface Column {
  id: number;
  title: string;
  position: number;
  board_id: number;
  cards: Card[];
}

export interface Card {
  id: number;
  title: string;
  description: string | null;
  position: number;
  column_id: number;
  created_at: string;
  due_date: string | null;
  assignee: string | null;
}

// Boards
export const getBoards = () => api.get<Board[]>('/boards').then(r => r.data);
export const getBoard = (id: number) => api.get<Board>(`/boards/${id}`).then(r => r.data);
export const createBoard = (title: string) => api.post<Board>('/boards', { title }).then(r => r.data);
export const deleteBoard = (id: number) => api.delete(`/boards/${id}`);

// Columns
export const createColumn = (data: { title: string; position: number; board_id: number }) =>
  api.post<Column>('/columns', data).then(r => r.data);
export const updateColumn = (id: number, data: { title?: string; position?: number }) =>
  api.patch<Column>(`/columns/${id}`, data).then(r => r.data);
export const deleteColumn = (id: number) => api.delete(`/columns/${id}`);

// Cards
export const createCard = (data: { title: string; description?: string; position: number; column_id: number; due_date?: string; assignee?: string }) =>
  api.post<Card>('/cards', data).then(r => r.data);
export const updateCard = (id: number, data: { title?: string; description?: string; position?: number; column_id?: number; due_date?: string | null; assignee?: string | null }) =>
  api.patch<Card>(`/cards/${id}`, data).then(r => r.data);
export const deleteCard = (id: number) => api.delete(`/cards/${id}`);
