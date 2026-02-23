from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.card import Card
from app.schemas.card import CardCreate, CardRead, CardUpdate

router = APIRouter(tags=["cards"])


@router.get("/cards/{column_id}", response_model=list[CardRead])
def list_cards(column_id: int, db: Session = Depends(get_db)) -> list[Card]:
    """List all cards for a given column."""
    return db.query(Card).filter(Card.column_id == column_id).all()


@router.post("/cards", response_model=CardRead, status_code=201)
def create_card(card_in: CardCreate, db: Session = Depends(get_db)) -> Card:
    """Create a new card."""
    card = Card(
        title=card_in.title,
        description=card_in.description,
        position=card_in.position,
        column_id=card_in.column_id,
        due_date=card_in.due_date,
        assignee=card_in.assignee,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.patch("/cards/{card_id}", response_model=CardRead)
def update_card(
    card_id: int, card_in: CardUpdate, db: Session = Depends(get_db)
) -> Card:
    """Update a card's fields."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    if card_in.title is not None:
        card.title = card_in.title
    if card_in.description is not None:
        card.description = card_in.description
    if card_in.position is not None:
        card.position = card_in.position
    if card_in.column_id is not None:
        card.column_id = card_in.column_id
    if "due_date" in card_in.model_fields_set:
        card.due_date = card_in.due_date
    if "assignee" in card_in.model_fields_set:
        card.assignee = card_in.assignee
    db.commit()
    db.refresh(card)
    return card


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, db: Session = Depends(get_db)) -> None:
    """Delete a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(card)
    db.commit()
