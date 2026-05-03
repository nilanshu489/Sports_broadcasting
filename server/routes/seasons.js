const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT se.*, t.tournament_name
      FROM SEASON se
      LEFT JOIN TOURNAMENT t ON se.tournament_id = t.tournament_id
      ORDER BY se.season_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { season_year, start_date, end_date, tournament_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO SEASON (season_year, start_date, end_date, tournament_id) VALUES (?, ?, ?, ?)',
      [season_year, start_date, end_date, tournament_id || null]
    );
    res.status(201).json({ season_id: result.insertId, season_year, start_date, end_date, tournament_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
