# MindFeed

A modern web application with a React (Vite) frontend and a Python (Flask) backend.

## Project Structure

- **root/**: Frontend (React + Vite)
- **api/**: Backend (Flask)

## Setup

1.  **Install Frontend Dependencies**:
    ```bash
    npm install
    ```

2.  **Install Backend Dependencies**:
    ```bash
    cd api
    pip install -r requirements.txt
    cd ..
    ```

## Development

To run both the frontend and backend concurrently:

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8080](http://localhost:8080)

## Deployment (Vercel)

This project is configured for Vercel.

1.  Push to GitHub.
2.  Import the project into Vercel.
3.  Vercel should automatically detect the Vite framework.
4.  The `vercel.json` file handles routing API requests to the Python backend.
