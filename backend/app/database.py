from typing import Any
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://username:password@db:5432/database_name"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@as_declarative()
class Base:
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
