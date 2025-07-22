# Notes App

A full-stack notes application built with React (frontend) and Node.js/Express + PostgreSQL (backend). The frontend uses Tailwind CSS for styling.

## Features
- Create, edit, delete, and search notes
- Dark mode toggle
- Responsive design
- PostgreSQL database integration

## Project Structure
```
notes_app/
  backend/      # Express.js backend API
  frontend/     # React frontend app
```

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd notes_app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

- Create a `.env` file in the `backend` directory with your PostgreSQL connection string:
  ```env
  DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
  ```
- Start the backend server:
  ```bash
  npm run dev
  # or
  npm start
  ```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
- Start the React app:
  ```bash
  npm start
  ```

## Tailwind CSS Setup (already configured)
- Tailwind CSS is set up in `frontend`.
- Main CSS file: `frontend/src/index.css`
- Tailwind config: `frontend/tailwind.config.js`

## Environment Variables
- Backend: `.env` file for database connection
- Frontend: No environment variables required by default

## Important Notes
- **Do not push `node_modules` to GitHub!**
  - Both `backend` and `frontend` have their own `node_modules` directories.
  - These are excluded by default using `.gitignore`.
- All code comments are in English for clarity.

## Example API Endpoints
- `GET    /api/notes`         - Get all notes
- `GET    /api/notes/:id`     - Get a note by ID
- `POST   /api/notes`         - Create a new note
- `PUT    /api/notes/:id`     - Update a note
- `DELETE /api/notes/:id`     - Delete a note

## License
MIT 