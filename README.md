# Skylitho Communications

Pre-owned printing machinery B2B website — Node.js/Express backend with JSON storage, vanilla JS frontend.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env
# Edit .env — set ADMIN_PASSWORD and JWT_SECRET

# 3. Start the server
npm start        # production
npm run dev      # development (auto-reload)
```

Open http://localhost:3000

## Admin Panel

Click the small **•** dot in the footer, enter your admin password.  
First-time password (change via `.env`): `skylitho2024`

## Project Structure

```text
SKY/
├── server.js               ← Express entry point
├── package.json
├── .env.example
├── Dockerfile
├── render.yaml             ← Render.com deployment config
├── data/
│   └── machines.json       ← Auto-created on first run
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── backend/
    ├── config/config.js    ← Environment config
    ├── auth/auth.js        ← JWT middleware
    ├── database/
    │   ├── db.js           ← JSON file storage
    │   └── machines.js     ← Machine CRUD
    └── routes/
        ├── auth.js         ← POST /api/auth/login
        └── machines.js     ← GET/POST/PUT/DELETE /api/machines
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/machines | — | List all machines |
| GET | /api/machines/:id | — | Get single machine |
| POST | /api/machines | Admin | Add machine |
| PUT | /api/machines/:id | Admin | Update machine |
| PATCH | /api/machines/:id/sold | Admin | Toggle sold status |
| DELETE | /api/machines/:id | Admin | Delete machine |
| POST | /api/auth/login | — | Login → returns JWT |
| POST | /api/auth/verify | — | Verify JWT token |

## Deploy to Render

1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your repo — Render auto-detects `render.yaml`
4. Set `ADMIN_PASSWORD` in the Render environment variables dashboard
5. Deploy

## Deploy with Docker

```bash
docker build -t skylitho .
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD=yourpassword \
  -e JWT_SECRET=yoursecret \
  -v $(pwd)/data:/data \
  skylitho
```
