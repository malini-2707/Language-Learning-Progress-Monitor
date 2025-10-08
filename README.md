# Language Learning Progress Monitor

A pastel peach themed full-stack web app to track language learning progress.

## Tech Stack
- Frontend: React (CRA), Tailwind CSS, Recharts, Lucide, Framer Motion, React Router v6, React Hot Toast
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth
- Deployment: Netlify (frontend) + Render/Railway (backend)

## Monorepo Structure
```
language-progress-monitor/
├── client/              # React app
└── server/              # Express API
```

## Quick Start

1) Prereqs: Node 18+, MongoDB connection string (Atlas or local)

2) Backend
```
cd server
cp .env.example .env   # fill MONGO_URI and JWT_SECRET
npm install
npm run dev
```

3) Frontend
```
cd client
npm install
npm start
```

## Environment
- server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster/db
JWT_SECRET=super-secret-change-me
CLIENT_ORIGIN=http://localhost:3000
```

## Scripts
- client: `npm start`, build: `npm run build`
- server: `npm run dev` (nodemon) or `npm start`

## Deployment
- Frontend: Netlify build command `npm run build`, publish `client/build`
- Backend: Render/Railway, environment variables from server/.env

## Notes
- Pastel peach theme via Tailwind custom colors in `client/tailwind.config.js`
- Protected routes using JWT in `client/src/routes/ProtectedRoute.jsx`
- API base config in `client/src/utils/api.js`
