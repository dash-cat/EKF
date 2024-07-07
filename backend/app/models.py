from sqlalchemy import Column, Integer, String, Boolean
from .database import Base  # Используйте относительный импорт

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    is_active = Column(Boolean, default=True)  # Обратите внимание на правильное использование Column

# Пример другой модели
class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    is_active = Column(Boolean, default=True)  # Обратите внимание на правильное использование Column
