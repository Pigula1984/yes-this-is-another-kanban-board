from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.board import Board
    from app.models.card import Card


class Column(Base):
    """Column model representing a column within a Kanban board."""

    __tablename__ = "columns"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id"), nullable=False)

    board: Mapped[Board] = relationship("Board", back_populates="columns")
    cards: Mapped[list[Card]] = relationship(
        "Card", back_populates="column", cascade="all, delete-orphan"
    )
