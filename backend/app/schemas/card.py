from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class CardBase(BaseModel):
    """Base schema for card data."""

    title: str
    description: str | None = None
    position: int
    column_id: int
    due_date: datetime | None = None
    assignee: str | None = None


class CardCreate(CardBase):
    """Schema for creating a card."""


class CardUpdate(BaseModel):
    """Schema for partially updating a card."""

    title: str | None = None
    description: str | None = None
    position: int | None = None
    column_id: int | None = None
    due_date: datetime | None = None
    assignee: str | None = None


class CardRead(CardBase):
    """Schema for reading card data."""

    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
