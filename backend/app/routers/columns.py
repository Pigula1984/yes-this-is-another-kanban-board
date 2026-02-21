from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.column import Column
from app.schemas.column import ColumnCreate, ColumnRead, ColumnUpdate

router = APIRouter(tags=["columns"])


@router.get("/columns/{board_id}", response_model=list[ColumnRead])
def list_columns(board_id: int, db: Session = Depends(get_db)) -> list[Column]:
    """List all columns for a given board."""
    return db.query(Column).filter(Column.board_id == board_id).all()


@router.post("/columns", response_model=ColumnRead, status_code=201)
def create_column(column_in: ColumnCreate, db: Session = Depends(get_db)) -> Column:
    """Create a new column."""
    column = Column(
        title=column_in.title,
        position=column_in.position,
        board_id=column_in.board_id,
    )
    db.add(column)
    db.commit()
    db.refresh(column)
    return column


@router.patch("/columns/{column_id}", response_model=ColumnRead)
def update_column(
    column_id: int, column_in: ColumnUpdate, db: Session = Depends(get_db)
) -> Column:
    """Update a column's title or position."""
    column = db.query(Column).filter(Column.id == column_id).first()
    if column is None:
        raise HTTPException(status_code=404, detail="Column not found")
    if column_in.title is not None:
        column.title = column_in.title
    if column_in.position is not None:
        column.position = column_in.position
    db.commit()
    db.refresh(column)
    return column


@router.delete("/columns/{column_id}", status_code=204)
def delete_column(column_id: int, db: Session = Depends(get_db)) -> None:
    """Delete a column."""
    column = db.query(Column).filter(Column.id == column_id).first()
    if column is None:
        raise HTTPException(status_code=404, detail="Column not found")
    db.delete(column)
    db.commit()
