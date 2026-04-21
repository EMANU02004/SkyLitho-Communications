require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const { initDb }        = require('./backend/database/db');
const authRoutes        = require('./backend/routes/auth');
const machineRoutes     = require('./backend/routes/machines');

const app  = express();
const PORT = process.env.PORT || 3000;

initDb();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/auth',     authRoutes);
app.use('/api/machines', machineRoutes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Skylitho server running on http://localhost:${PORT}`);
});
