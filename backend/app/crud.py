from sqlalchemy.orm import Session
from . import models
from pydantic import BaseModel

class Estimate(BaseModel):
    item: str
    quantity: int
    price: float

class DrawingCreate(BaseModel):
    pass

def get_drawings(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Drawing).offset(skip).limit(limit).all()

def create_drawing(db: Session, drawing: DrawingCreate):
    db_drawing = models.Drawing(**drawing.dict())
    db.add(db_drawing)
    db.commit()
    db.refresh(db_drawing)
    return db_drawing
