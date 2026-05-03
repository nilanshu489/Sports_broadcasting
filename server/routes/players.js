const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/players — with JOIN on TEAM
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, t.team_name
      FROM PLAYER p
      LEFT JOIN TEAM t ON p.team_id = t.team_id
      ORDER BY p.player_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/players
router.post('/', auth, async (req, res) => {
  const { player_name, role, nationality, team_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO PLAYER (player_name, role, nationality, team_id) VALUES (?, ?, ?, ?)',
      [player_name, role, nationality, team_id || null]
    );
    res.status(201).json({ player_id: result.insertId, player_name, role, nationality, team_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/players/:id
router.put('/:id', auth, async (req, res) => {
  const { player_name, role, nationality, team_id } = req.body;
  try {
    await pool.query(
      'UPDATE PLAYER SET player_name=?, role=?, nationality=?, team_id=? WHERE player_id=?',
      [player_name, role, nationality, team_id || null, req.params.id]
    );
    res.json({ message: 'Player updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/players/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM PLAYER WHERE player_id=?', [req.params.id]);
    res.json({ message: 'Player deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
