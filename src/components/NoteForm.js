import { useState, useEffect } from "react";
import axios from "axios";
import { Fab, Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


const NoteForm = ({ fetchNotes, editNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
      setNoteId(editNote.id);
      setOpen(true);
    }
  }, [editNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = { title, content };
    try {
      if (noteId) {
        await axios.put(`http://127.0.0.1:8000/api/notes/${noteId}`, noteData);
      } else {
        await axios.post("http://127.0.0.1:8000/api/notes", noteData);
      }
      setTitle("");
      setContent("");
      setNoteId(null);
      setOpen(false);
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <div>
      {/* Add button */}
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={() => {
          setTitle(""); 
          setContent(""); 
          setNoteId(null);  
          setOpen(true);
        }}
        style={{ position: "fixed", bottom: 20, right: 20 }}
      >

        <AddIcon />
      </Fab>

      {/* Dialog box on clicking add button */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{noteId ? "Edit Note" : "Add Note"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "10px", width: "500px" }}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth autoFocus />
            <TextField label="Content" value={content} onChange={(e) => setContent(e.target.value)} required fullWidth multiline rows={3} />
            <Button type="submit" variant="contained" color="primary">
              {noteId ? "Update" : "Add"} Note
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoteForm;