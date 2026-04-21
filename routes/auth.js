const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const config = require('../config/config');

router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== config.adminPassword) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  const token = jwt.sign({ admin: true }, config.jwtSecret, { expiresIn: '8h' });
  res.json({ token });
});

router.post('/verify', (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.json({ valid: false });
  try {
    jwt.verify(token, config.jwtSecret);
    res.json({ valid: true });
  } catch {
    res.json({ valid: false });
  }
});

module.exports = router;
