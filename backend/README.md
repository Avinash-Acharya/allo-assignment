# Clinic Front Desk Backend

NestJS + TypeORM + MySQL API providing authentication, queue management, doctor profiles and appointment handling.

## Run
Create `.env` (or export env vars):
```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=clinic
JWT_SECRET=supersecret
```
Install & start:
```
npm install
npm run start:dev
```
A seed staff user is created automatically: `staff` / `password`.

## Endpoints (JWT protected except /auth/login)
POST /auth/login {username,password}
GET /doctors
POST /doctors
PUT /doctors/:id
DELETE /doctors/:id
GET /appointments
GET /appointments/:date (YYYY-MM-DD)
POST /appointments
PATCH /appointments/:id/status
PATCH /appointments/:id/reschedule
PATCH /appointments/:id/cancel
GET /queue
POST /queue
PATCH /queue/:id/status
DELETE /queue/:id

Queue priority: lower number = higher priority (0 urgent, 1 normal).
