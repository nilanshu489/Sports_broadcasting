const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM SPORT ORDER BY sport_id');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { sport_name, governing_body } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO SPORT (sport_name, governing_body) VALUES (?, ?)',
      [sport_name, governing_body]
    );
    res.status(201).json({ sport_id: result.insertId, sport_name, governing_body });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
