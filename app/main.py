from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from typing import List

from . import models, schemas, crud, database
from fastapi.middleware.cors import CORSMiddleware
from .logging_config import logger 

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# ------------------ Global Exception Handler ------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected Error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "An unexpected error occurred. Please try again later."},
    )

#------------Database Exception(e.g., connection failures, query errors)-------------
@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database Error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "A database error occurred. Please contact support."},
    )


# Database Initialization
models.Base.metadata.create_all(bind=database.engine)

# ------------------ CREATE A NOTE ------------------
@app.post("/api/notes", response_model=schemas.NoteResponse, status_code=201)
def create_note(note: schemas.NoteCreate, db: Session = Depends(database.get_db)):
    logger.info(f"Creating a new note: {note.title}")
    return crud.create_note(db, note)

# ------------------ READ ALL NOTES ------------------
@app.get("/api/notes", response_model=List[schemas.NoteResponse])
def get_notes(db: Session = Depends(database.get_db)):
    logger.info("Fetching all notes")
    return crud.get_notes(db)

# ------------------ READ A SINGLE NOTE ------------------
@app.get("/api/notes/{note_id}", response_model=schemas.NoteResponse)
def get_note(note_id: int, db: Session = Depends(database.get_db)):
    note = crud.get_note(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

# ------------------ UPDATE A NOTE ------------------
@app.put("/api/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(note_id: int, note: schemas.NoteCreate, db: Session = Depends(database.get_db)):
    logger.info(f"Updating the existing note: {note.title}")
    updated_note = crud.update_note(db, note_id, note)
    if not updated_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated_note

# ------------------ DELETE A NOTE ------------------
@app.delete("/api/notes/{note_id}", status_code=204)
def delete_note(note_id: int, db: Session = Depends(database.get_db)):
    logger.info("Deleting the selected Note:")
    deleted_note = crud.delete_note(db, note_id)
    if not deleted_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}
