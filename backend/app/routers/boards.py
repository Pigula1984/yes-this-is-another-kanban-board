from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.board import Board
from app.schemas.board import BoardCreate, BoardRead

router = APIRouter(tags=["boards"])


@router.get("/boards", response_model=list[BoardRead])
def list_boards(db: Session = Depends(get_db)) -> list[Board]:
    """List all boards with their columns and cards."""
    return db.query(Board).all()


@router.post("/boards", response_model=BoardRead, status_code=201)
def create_board(board_in: BoardCreate, db: Session = Depends(get_db)) -> Board:
    """Create a new board."""
    board = Board(title=board_in.title)
    db.add(board)
    db.commit()
    db.refresh(board)
    return board


@router.get("/boards/{board_id}", response_model=BoardRead)
def get_board(board_id: int, db: Session = Depends(get_db)) -> Board:
    """Get a board with its columns and cards."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


@router.delete("/boards/{board_id}", status_code=204)
def delete_board(board_id: int, db: Session = Depends(get_db)) -> None:
    """Delete a board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    db.delete(board)
    db.commit()
