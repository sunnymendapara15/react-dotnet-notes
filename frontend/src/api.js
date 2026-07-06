const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function handleResponse(response, expectJson = true) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  if (!expectJson) {
    return null;
  }

  return response.json();
}

export async function fetchNotes() {
  const response = await fetch(`${API_BASE}/notes`);
  return handleResponse(response);
}

export async function createNote(note) {
  const response = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return handleResponse(response);
}

export async function updateNote(id, note) {
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return handleResponse(response);
}

export async function deleteNote(id) {
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, false);
}
