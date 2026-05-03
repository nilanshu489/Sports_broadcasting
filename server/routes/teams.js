const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/teams
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM TEAM ORDER BY team_id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/teams
router.post('/', auth, async (req, res) => {
  const { team_name, home_city, coach_name } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO TEAM (team_name, home_city, coach_name) VALUES (?, ?, ?)',
      [team_name, home_city, coach_name]
    );
    res.status(201).json({ team_id: result.insertId, team_name, home_city, coach_name });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/teams/:id
router.put('/:id', auth, async (req, res) => {
  const { team_name, home_city, coach_name } = req.body;
  try {
    await pool.query(
      'UPDATE TEAM SET team_name=?, home_city=?, coach_name=? WHERE team_id=?',
      [team_name, home_city, coach_name, req.params.id]
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
