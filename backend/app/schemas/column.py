from __future__ import annotations

from pydantic import BaseModel

from app.schemas.card import CardRead


class ColumnBase(BaseModel):
    """Base schema for column data."""

    title: str
    position: int
    board_id: int


class ColumnCreate(ColumnBase):
    """Schema for creating a column."""


class ColumnUpdate(BaseModel):
    """Schema for partially updating a column."""

    title: str | None = None
    position: int | None = None


class ColumnRead(ColumnBase):
    """Schema for reading column data."""

    id: int
    cards: list[CardRead] = []

    model_config = {"from_attributes": True}
