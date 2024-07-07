from pydantic import BaseModel

class Estimate(BaseModel):
    item: str
    quantity: int
    price: float

class DrawingCreate(BaseModel):
    pass
