import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TableSortLabel, Button, Dialog, DialogTitle, DialogContent} from "@mui/material";

const NoteList = ({ notes, fetchNotes, setEditNote }) => {
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [viewNote, setViewNote] = useState(null);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selected.map((id) => axios.delete(`http://127.0.0.1:8000/api/notes/${id}`)));
      setSelected([]);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting notes:", error);
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (orderBy === "title" || orderBy === "updated_at") {
      return order === "asc" ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
    }
    return order === "asc" ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
  });

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", textAlign: "center", margin: "20px auto", maxWidth: "900px" }}>
      
      
      <TableContainer component={Paper} style={{ borderRadius: "10px", boxShadow: "0 3px 10px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <Table>
          <TableHead style={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < notes.length}
                  checked={notes.length > 0 && selected.length === notes.length}
                  onChange={() => setSelected(selected.length === notes.length ? [] : notes.map((note) => note.id))}
                  style={{ color: "white" }}
                />
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <TableSortLabel active={orderBy === "id"} direction={order} onClick={() => handleSort("id")}>
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <TableSortLabel active={orderBy === "title"} direction={order} onClick={() => handleSort("title")}>
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ color: "white" }}>Content</TableCell>
              <TableCell style={{ color: "white" }}>
                <TableSortLabel active={orderBy === "updated_at"} direction={order} onClick={() => handleSort("updated_at")}>
                  Updated Date
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ color: "white" }}>Updated Time</TableCell>
              <TableCell style={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedNotes.map((note) => (
              <TableRow key={note.id} hover>
                <TableCell>
                  <Checkbox checked={selected.includes(note.id)} onChange={() => handleSelect(note.id)} />
                </TableCell>
                <TableCell>{note.id}</TableCell>
                <TableCell>{note.title}</TableCell>
                <TableCell>{note.content.length > 15 ? note.content.substring(0, 15) + "..." : note.content}</TableCell>
                <TableCell>{note.updated_at ? dayjs(note.updated_at).format("DD-MM-YYYY") : "N/A"}</TableCell>
                <TableCell>{note.updated_at ? dayjs(note.updated_at).format("HH:mm:ss") : "N/A"}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" size="small" onClick={() => setEditNote(note)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" size="small" onClick={() => setViewNote(note)} style={{ marginLeft: "10px" }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selected.length > 0 && (
        <Button variant="contained" color="secondary" onClick={handleDeleteSelected} style={{ marginTop: "15px" }}>
          Delete Selected
        </Button>
      )}

      <Dialog open={!!viewNote} onClose={() => setViewNote(null)}>
        <DialogTitle>View Note</DialogTitle>
        <DialogContent>
          <p><strong>Title:</strong> {viewNote?.title}</p>
          <p><strong>Content:</strong> {viewNote?.content}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoteList;
