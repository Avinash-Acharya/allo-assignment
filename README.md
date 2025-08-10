# Clinic Front Desk System

Full‑stack demo application for managing a clinic front desk: staff authentication, doctors, appointments, and patient queue.

| Layer | Tech |
|-------|------|
| Frontend | Next.js (App Router) + React + (Tailwind ready) |
| Backend | NestJS + TypeORM |
| Database | MySQL 8 (via Docker) |
| Auth | JWT (Bearer tokens) |

---

## 1. Repository Structure

```
backend/            NestJS API (authentication, doctors, queue, appointments)
frontend/           Next.js UI (login + dashboard)
docker-compose.yml  MySQL service for local development
```

---

## 2. Prerequisites

Required:
* Node.js 18+ (LTS recommended)
* npm 9+
* Docker Desktop (for MySQL container) OR an existing MySQL instance

Check versions (PowerShell):
```powershell
node -v
npm -v
docker --version
```

If you cannot install Docker, you must provide a reachable MySQL 8 server matching the environment variables shown below.

---

## 3. Cloning the Project

```powershell
git clone https://github.com/Avinash-Acharya/allo-assignment.git
cd allo-assignment
```

If you forked the repo, replace the URL accordingly.

---

## 4. Quick Start (Happy Path)

```powershell
# From repo root
docker compose up -d db   # Start MySQL

# Backend
cd backend
Copy-Item .env.example .env -ErrorAction SilentlyContinue # (if we add an example file later)
@'
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=clinic
JWT_SECRET=supersecret
'@ | Out-File -Encoding utf8 .env
npm install
npm run start:dev

# New terminal for frontend
cd ../frontend
@'
NEXT_PUBLIC_API_URL=http://localhost:3001
'@ | Out-File -Encoding utf8 .env.local
npm install
npm run dev
```

Open: http://localhost:3000 → redirect to /login

Login with: `staff / password` (seed user created automatically on first backend start).

---

## 5. Detailed Setup

### 5.1 Start MySQL with Docker

`docker-compose.yml` includes a `db` service.

```powershell
docker compose up -d db
```

First startup takes ~10–20s while MySQL initializes. Check status:
```powershell
docker ps
docker logs -f clinic-mysql
```

If port 3306 is already used, edit `docker-compose.yml` mapping to `3307:3306` and set `DB_PORT=3307` in backend `.env`.

### 5.2 Backend Environment

Create `backend/.env` (values align with docker service):
```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=clinic
JWT_SECRET=supersecret
```

### 5.3 Install & Run Backend
```powershell
cd backend
npm install
npm run start:dev   # Watches for changes
```

The server listens on `http://localhost:3001`. On first run it seeds a staff user.

### 5.4 Frontend Environment

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5.5 Install & Run Frontend
```powershell
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`.

---

## 6. Authentication

Endpoint: `POST /auth/login` with JSON `{ "username": "staff", "password": "password" }`.

Response: `{ "access_token": "<JWT>" }`.

Protected endpoints require header: `Authorization: Bearer <JWT>`.

---

## 7. Core API Endpoints (Summary)

Unauthenticated:
* `POST /auth/login`

Authenticated (Bearer JWT):
* Doctors: `GET /doctors`, `POST /doctors`, `PUT /doctors/:id`, `DELETE /doctors/:id`
* Appointments: `GET /appointments`, `GET /appointments/:date`, `POST /appointments`, `PATCH /appointments/:id/status`, `PATCH /appointments/:id/reschedule`, `PATCH /appointments/:id/cancel`
* Queue: `GET /queue`, `POST /queue`, `PATCH /queue/:id/status`, `DELETE /queue/:id`

Notes:
* Lower queue `priority` value = higher urgency (0 urgent, 1 normal default).
* Some DTOs accept a `createdById` field; in a production system this would come from the authenticated user context rather than request body.

---

## 8. Testing API Manually (PowerShell)

```powershell
# Login
$resp = Invoke-RestMethod -Method Post -Uri http://localhost:3001/auth/login -Body (@{username='staff';password='password'} | ConvertTo-Json) -ContentType 'application/json'
$token = $resp.access_token

# List queue
Invoke-RestMethod -Headers @{Authorization="Bearer $token"} -Uri http://localhost:3001/queue

# Add doctor
Invoke-RestMethod -Method Post -Uri http://localhost:3001/doctors -Headers @{Authorization="Bearer $token"} -Body (@{name='Dr. House'; specialization='Diagnostics'} | ConvertTo-Json) -ContentType 'application/json'

# Add queue entry
Invoke-RestMethod -Method Post -Uri http://localhost:3001/queue -Headers @{Authorization="Bearer $token"} -Body (@{patientName='Jane Doe'; createdById=1; priority=1} | ConvertTo-Json) -ContentType 'application/json'
```

---

## 9. Development Scripts

Backend (`/backend/package.json`):
* `npm run start:dev` – Run with watch mode
* `npm run build` – Compile TypeScript
* `npm run lint` – ESLint
* `npm run format` – Prettier write

Frontend (`/frontend/package.json`):
* `npm run dev` – Next.js dev server
* `npm run build` – Production build
* `npm start` – Start built app
* `npm run lint` – ESLint

---

## 10. Common Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ECONNREFUSED` connecting to MySQL | Container not ready | Wait 10–20s or check `docker logs clinic-mysql` |
| `Access denied for user 'root'` | Wrong password | Ensure `MYSQL_ROOT_PASSWORD` matches `DB_PASS` |
| 401 on protected endpoints | Missing/expired token | Re-login and include `Authorization` header |
| Port 3001 already in use | Conflict | Change `PORT` in backend `.env` (and frontend `NEXT_PUBLIC_API_URL`) |
| Port 3306 busy | Existing MySQL | Change compose mapping to `3307:3306` and set `DB_PORT=3307` |

---

## 11. Data Persistence

MySQL data stored in named Docker volume `mysql_data`. To wipe all data (including seed user):
```powershell
docker compose down -v
docker compose up -d db
```

---

## 12. Environment Variable Reference

Backend (`backend/.env`):
```
PORT=3001          # API listen port
DB_HOST=localhost  # MySQL host
DB_PORT=3306       # MySQL port
DB_USER=root       # MySQL user
DB_PASS=password   # MySQL password (matches docker-compose)
DB_NAME=clinic     # Database name (auto-created by container)
JWT_SECRET=supersecret
```

Frontend (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 13. Security Notes (Development Only)
* `synchronize: true` in TypeORM auto-syncs schema; disable in production in favor of migrations.
* Hard-coded / simple secrets are for local dev only — replace with secure values in production.
* DTOs currently allow specifying `createdById`; in production derive this from the JWT payload.

---

## 14. Roadmap / Potential Enhancements
* Real user management + roles / permissions
* Migrations instead of auto-sync
* Input forms for creating queue entries & appointments in UI
* Doctor availability visualization
* Optimistic UI & client caching (React Query / SWR)
* Integration tests (Supertest) and component tests
* Docker multi-service dev container (frontend + backend + db)

---

## 15. Support / Contribution
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/xyz`
3. Commit changes: `git commit -m "feat: add xyz"`
4. Push branch: `git push origin feature/xyz`
5. Open a Pull Request

---

Happy hacking! Let the queue move fast and patients wait less.
