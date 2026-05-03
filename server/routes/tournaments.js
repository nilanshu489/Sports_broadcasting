const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { sport_id, level } = req.query;
    let query = `
      SELECT t.*, s.sport_name
      FROM TOURNAMENT t
      LEFT JOIN SPORT s ON t.sport_id = s.sport_id
      WHERE 1=1
    `;
    const params = [];
    if (sport_id) { query += ' AND t.sport_id = ?'; params.push(sport_id); }
    if (level) { query += ' AND t.tournament_level = ?'; params.push(level); }
    query += ' ORDER BY t.tournament_id DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { tournament_name, host_country, sport_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO TOURNAMENT (tournament_name, host_country, sport_id) VALUES (?, ?, ?)',
      [tournament_name, host_country, sport_id || null]
    );
    res.status(201).json({ tournament_id: result.insertId, tournament_name, host_country, sport_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
