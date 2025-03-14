import { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import ChecklistTwoToneIcon from '@mui/icons-material/ChecklistTwoTone';
import backgroundImage from "./images/image-cache.jpg";

function App() {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    
      <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        textAlign: "center",
        fontFamily: "cursive",
        padding: "125px",
      }}
    >
      <h1 style={{ color: "#1976d2" }}><ChecklistTwoToneIcon fontSize="large" /> NOTES</h1>
      <NoteForm fetchNotes={fetchNotes} editNote={editNote} />
      <NoteList notes={notes} fetchNotes={fetchNotes} setEditNote={setEditNote} />
      </div>
    
    
  );
}

export default App;
