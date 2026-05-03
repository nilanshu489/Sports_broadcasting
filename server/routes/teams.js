const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/teams
router.get('/', auth, async (req, res) => {
  try {
    const { sport_id, team_level, tournament_id } = req.query;
    let query = 'SELECT * FROM TEAM WHERE 1=1';
    const params = [];
    if (sport_id) { query += ' AND sport_id = ?'; params.push(sport_id); }
    if (team_level) { query += ' AND team_level = ?'; params.push(team_level); }
    if (tournament_id) { query += ' AND tournament_id = ?'; params.push(tournament_id); }
    query += ' ORDER BY team_id DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/teams
router.post('/', auth, async (req, res) => {
  const { team_name, home_city, coach_name, sport_id, team_level, tournament_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO TEAM (team_name, home_city, coach_name, sport_id, team_level, tournament_id) VALUES (?, ?, ?, ?, ?, ?)',
      [team_name, home_city, coach_name, sport_id || null, team_level || 'Franchise', tournament_id || null]
    );
    res.status(201).json({ team_id: result.insertId, team_name, home_city, coach_name, sport_id, team_level, tournament_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/teams/:id
router.put('/:id', auth, async (req, res) => {
  const { team_name, home_city, coach_name, sport_id, team_level, tournament_id } = req.body;
  try {
    await pool.query(
      'UPDATE TEAM SET team_name=?, home_city=?, coach_name=?, sport_id=?, team_level=?, tournament_id=? WHERE team_id=?',
      [team_name, home_city, coach_name, sport_id || null, team_level || 'Franchise', tournament_id || null, req.params.id]
    );
    res.json({ message: 'Team updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/teams/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM TEAM WHERE team_id=?', [req.params.id]);
    res.json({ message: 'Team deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
