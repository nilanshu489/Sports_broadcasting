const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    const [rows] = await pool.query('SELECT * FROM ADMIN WHERE username = ?', [username]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid credentials' });

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.admin_id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/setup  — creates admin on first run
router.post('/setup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO ADMIN (username, password_hash) VALUES (?, ?)', [username, hash]);
    res.json({ message: 'Admin created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
