# MediDrone — AI Emergency Healthcare & Drone Response Platform

A full-stack starter application with:
- React + Vite frontend
- Node.js + Express backend
- PostgreSQL schema
- JWT authentication
- Emergency management
- Drone/ambulance dispatch
- Nearby hospitals/pharmacies
- Medicine requests
- AI Emergency Coordinator demo
- Socket.IO real-time emergency updates
- Netlify-ready frontend configuration

## Requirements
- Node.js 20+
- PostgreSQL 15+
- VS Code

## 1. Backend setup
```bash
cd backend
npm install
copy .env.example .env
```
On macOS/Linux use:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/medidrone
JWT_SECRET=change-this-secret
CLIENT_URL=http://localhost:5173
```

Create a PostgreSQL database named `medidrone`, then run:
```bash
psql -U postgres -d medidrone -f ../database/schema.sql
npm run dev
```

## 2. Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
On macOS/Linux:
```bash
cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Demo login
Register a user from the UI. The dashboard also works with demo data without external medical integrations.

## API
Auth:
- POST /api/auth/register
- POST /api/auth/login

Emergencies:
- POST /api/emergencies
- GET /api/emergencies
- GET /api/emergencies/:id
- PUT /api/emergencies/:id/status

Drones:
- GET /api/drones
- GET /api/drones/:id
- POST /api/drones/:id/dispatch

Services:
- GET /api/hospitals/nearby
- GET /api/pharmacies/nearby
- GET /api/medicines
- POST /api/medicine-request
- POST /api/ai/emergency-coordinator

Real-time:
- Socket.IO namespace events for emergency status updates.

## Netlify
The frontend is configured with `netlify.toml`. Deploy the `frontend` directory to Netlify after setting:
```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
VITE_SOCKET_URL=https://YOUR-BACKEND-DOMAIN
```

Do not put database passwords or JWT secrets in frontend environment variables.

## Production safety
This is a prototype/starter platform. Real emergency dispatch, medical advice, payments, patient records, and drone operations require appropriate regulatory, security, clinical, aviation, and human approval controls.
