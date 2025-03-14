
from sqlalchemy import Column, Integer, String, DateTime, func
from .database import Base

class Note(Base):
    __tablename__ = "note"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(25), nullable=False)
    content = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now()) 