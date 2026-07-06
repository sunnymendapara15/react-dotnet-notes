import { useEffect, useState } from "react";
import {
  createNote,
  deleteNote as deleteNoteRequest,
  fetchNotes,
  updateNote as updateNoteRequest,
} from "./api";
import "./App.css";

const initialFormState = { title: "", content: "" };

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setNotesLoading(true);
    try {
      const data = await fetchNotes();
      const sorted = [...data].sort((a, b) => b.id - a.id);
      setNotes(sorted);
      setError("");
    } catch (err) {
      setError("Unable to load notes. Please check the backend and try again.");
    } finally {
      setNotesLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() && !form.content.trim()) {
      setError("Add a title or content before saving.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const edited = await updateNoteRequest(editingId, form);
        setNotes((prev) =>
          prev.map((note) => (note.id === editingId ? edited : note))
        );
      } else {
        const created = await createNote(form);
        setNotes((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError("Unable to save the note at the moment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note.id);
    setError("");
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteNoteRequest(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError("Unable to delete this note. Try again shortly.");
    } finally {
      setDeletingId(null);
    }
  };

  const isBusy = notesLoading || saving;

  return (
    <div className="app-shell">
      <div className="panel">
        <header className="panel-header">
          <h1>Personal Notes</h1>
          <p>Store, edit, and delete notes without signing in.</p>
        </header>

        <form className="note-form" onSubmit={handleSubmit}>
          <input
            className="field"
            placeholder="Title (optional)"
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
          />
          <textarea
            className="field"
            rows={5}
            placeholder="Write your note here..."
            value={form.content}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, content: event.target.value }))
            }
          />
          <div className="form-actions">
            <button type="submit" className="primary" disabled={saving}>
              {editingId ? "Update note" : "Save note"}
            </button>
            {editingId && (
              <button
                type="button"
                className="ghost"
                onClick={resetForm}
                disabled={isBusy}
              >
                Cancel edit
              </button>
            )}
            <button
              type="button"
              className="ghost"
              onClick={loadNotes}
              disabled={notesLoading}
            >
              Refresh
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>

        <section className="notes-section">
          <div className="notes-heading">
            <h2>Saved notes</h2>
            <span>
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </span>
          </div>
          {notesLoading && <p className="status">Loading notes…</p>}
          {!notesLoading && !notes.length && (
            <p className="status">No notes yet. Start with your first one!</p>
          )}
          <ul className="note-list">
            {notes.map((note) => (
              <li className="note-card" key={note.id}>
                <div className="note-body">
                  <div className="note-title">
                    {note.title || "Untitled note"}
                  </div>
                  <p>{note.content}</p>
                </div>
                <div className="note-footer">
                  <small>
                    Updated {new Date(note.updatedAt).toLocaleString()}
                  </small>
                  <div className="note-actions">
                    <button onClick={() => handleEdit(note)} disabled={isBusy}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      disabled={deletingId === note.id}
                    >
                      {deletingId === note.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
