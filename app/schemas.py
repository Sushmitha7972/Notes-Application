from pydantic import BaseModel
from datetime import datetime

class NoteCreate(BaseModel):
    title: str
    content: str

class NoteResponse(NoteCreate):
    id: int
    updated_at: datetime 

    class Config:
        orm_mode = True