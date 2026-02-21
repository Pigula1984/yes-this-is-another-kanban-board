from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.schemas.column import ColumnRead


class BoardBase(BaseModel):
    """Base schema for board data."""

    title: str


class BoardCreate(BoardBase):
    """Schema for creating a board."""


class BoardRead(BoardBase):
    """Schema for reading board data."""

    id: int
    created_at: datetime
    columns: list[ColumnRead] = []

    model_config = {"from_attributes": True}
