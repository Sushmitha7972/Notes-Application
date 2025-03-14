from sqlalchemy.orm import Session
from . import models, schemas
from .logging_config import logger

def create_note(db: Session, note: schemas.NoteCreate):
    logger.info(f"Inserting note into database: {note.title}")
    db_note = models.Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    
    return db_note

def get_notes(db: Session):
    logger.info("Fetching all notes from the database")
    return db.query(models.Note).all()

def get_note(db: Session, note_id: int):
    return db.query(models.Note).filter(models.Note.id == note_id).first()

def update_note(db: Session, note_id: int, note: schemas.NoteCreate):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        return None
    db_note.title = note.title
    db_note.content = note.content
    db.commit()
    db.refresh(db_note)  
    return db_note

def delete_note(db: Session, note_id: int):
    logger.info(f"Deleting note with ID: {note_id}")
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        logger.warning(f"Note ID {note_id} not found")
        return None
    db.delete(db_note)
    db.commit()
    return db_note
