## Clinic Front Desk Frontend

This Next.js (App Router) frontend provides a UI for the Clinic Front Desk system (queue + appointment management).

### Pages
* `/login` – staff login (default seeded user: `staff` / `password`)
* `/dashboard` – combined queue + appointments management (basic CRUD actions against API)

### Environment
Create `.env.local` with:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Run
```
npm install
npm run dev
```
Visit http://localhost:3000

### Minimal Features Implemented
* JWT login storing token in localStorage
* List & update queue entries (status, urgent flag shown when priority=0)
* List & update appointments (status)

### Planned Enhancements
* Form to add queue patients and schedule/reschedule appointments
* Doctor management screens
* Client-side caching & optimistic UI
* Role-based route protection middleware

### Backend
See `../backend` for NestJS API (MySQL + TypeORM). Ensure it runs before using dashboard.
