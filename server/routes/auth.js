const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// POST /api/auth/login — works for BOTH admin and user accounts
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    // 1. Try ADMIN table first
    const [admins] = await pool.query('SELECT * FROM ADMIN WHERE username = ?', [username]);
    if (admins.length > 0) {
      const admin = admins[0];
      const valid = await bcrypt.compare(password, admin.password_hash);
      if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { id: admin.admin_id, username: admin.username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      return res.json({ token, username: admin.username, role: 'admin' });
    }

    // 2. Try APP_USER table
    const [users] = await pool.query('SELECT * FROM APP_USER WHERE username = ?', [username]);
    if (users.length > 0) {
      const user = users[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user.user_id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      return res.json({ token, username: user.username, role: user.role });
    }

    // 3. Neither found
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/signup — creates a new user account
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: 'Username, email, and password are required' });

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  try {
    // Check if username or email already exists
    const [existing] = await pool.query(
      'SELECT user_id FROM APP_USER WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0)
      return res.status(409).json({ message: 'Username or email already exists' });

    // Also check ADMIN table to prevent conflicts
    const [adminExists] = await pool.query('SELECT admin_id FROM ADMIN WHERE username = ?', [username]);
    if (adminExists.length > 0)
      return res.status(409).json({ message: 'Username already taken' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO APP_USER (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hash]
    );

    const token = jwt.sign(
      { id: result.insertId, username, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({ token, username, role: 'user', message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/setup — creates admin on first run
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
