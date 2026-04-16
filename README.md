# AI Prompt Library

A full-stack application for storing and managing AI Image Generation Prompts. Features an aesthetic React + Vite frontend, a Django backend, PostgreSQL for data persistence, and Redis for caching view counts.

## Tech Stack
*   **Frontend**: React (Vite), TypeScript, React-Router-DOM
*   **Backend**: Python, Django (No DRF just standard JsonResponse)
*   **Database**: PostgreSQL
*   **Cache**: Redis
*   **DevOps**: Docker & Docker Compose

## Architectural Decisions
1.  **React for Higher Visual Fidelity (Bonus Effort)**: Standard Vite + React combined with a customized CSS design system (Glassmorphism + inter font + microanimations) ensures a vastly superior user experience compared to the standard angular boilerplate.
2.  **Django Backend with Generic Views**: Maintained simplicity per the requirement of "no Django REST Framework" by using standard `JsonResponse` wrappers handling JSON loads natively.
3.  **Redis Interceptor Pattern**: Integrated a Redis client instantiated carefully to fallback gracefully in development, tracking `view_count` independently from the main Postgres database.
4.  **Reverse Proxy Frontend (Nginx)**: Docker frontend image builds statically and is served via an Nginx alpine image, natively proxying `/api/` requests cleanly to the backend container to bypass CORS complexity in production.
5.  **Bonus Features included**: Basic Authentication scaffold structure added to protect the POST endpoint, utilizing basic JWT logic. Tagging structure integrated onto initial model.

## Setup Instructions

### Running with Docker Compose (Recommended)
You only need `docker` and `docker-compose` installed.

1. Ensure Docker Desktop is running.
2. In the root directory (where `docker-compose.yml` is), run:
```bash
docker-compose up --build
```
3. This will spin up 4 containers (`db`, `redis`, `backend`, `frontend`).
4. **Access the application**: Go to `http://localhost:80` (or your mapped port if local port 80 is occupied, adjust your compose file).
5. The API will be available under `http://backend:8000/api/` locally on the container bridge network.

### Running Locally without Docker
If you prefer running just locally via standard Python/npm:

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate # (Or venv\Scripts\activate on Windows)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*(Make sure to set your frontend API URL in `src/api.ts` if your backend isn't running on `localhost:8000`)*.
