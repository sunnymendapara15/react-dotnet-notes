# React + .NET Notes App

Personal note-taking playground built for private use. React frontend consumes a lightweight ASP.NET Core Web API, allowing you to add, edit, and delete notes without any authentication.

## Features
- Create, edit, and delete notes without signing in.
- Frontend communicates with backend via simple REST endpoints.
- Notes stored in-memory (server restarts will clear them; extend storage as needed).
- Designed for personal use only.

## Running the backend

1. Open a terminal and run:
   ```
   cd backend
   dotnet run
   ```
2. The API listens on `http://localhost:5000` (HTTPS is also enabled by default).

## Running the frontend

1. In a separate terminal:
   ```
   cd frontend
   npm install
   npm start
   ```
2. The React app will run on `http://localhost:3000` and proxy to the backend. Update `REACT_APP_API_URL` to point to the API if you host it elsewhere.

## Notes API

- `GET /notes` – list all saved notes.
- `POST /notes` – add a note (`{ title: string, content: string }`).
- `PUT /notes/{id}` – update an existing note.
- `DELETE /notes/{id}` – delete a note.
