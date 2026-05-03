const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/players — with JOIN on TEAM
router.get('/', auth, async (req, res) => {
  try {
    let query = `
      SELECT p.*, 
             GROUP_CONCAT(t.team_name SEPARATOR ', ') as team_name,
             GROUP_CONCAT(t.team_id SEPARATOR ',') as team_ids
      FROM PLAYER p
      LEFT JOIN PLAYER_TEAM pt ON p.player_id = pt.player_id
      LEFT JOIN TEAM t ON pt.team_id = t.team_id
      WHERE 1=1
    `;
    const params = [];
    if (req.query.sport_id) {
      query += ` AND p.sport_id = ?`;
      params.push(req.query.sport_id);
    }
    query += ` GROUP BY p.player_id ORDER BY p.player_id DESC`;
    const [rows] = await pool.query(query, params);
    
    // Format team_ids as array for frontend
    const formattedRows = rows.map(row => ({
      ...row,
      team_ids: row.team_ids ? row.team_ids.split(',').map(Number) : []
    }));
    
    res.json(formattedRows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/players
router.post('/', auth, async (req, res) => {
  const { player_name, role, nationality, team_ids, sport_id } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      'INSERT INTO PLAYER (player_name, role, nationality, sport_id) VALUES (?, ?, ?, ?)',
      [player_name, role, nationality, sport_id || null]
    );
    const playerId = result.insertId;
    if (team_ids && Array.isArray(team_ids) && team_ids.length > 0) {
      const ptValues = team_ids.map(tid => [playerId, tid]);
      await connection.query('INSERT INTO PLAYER_TEAM (player_id, team_id) VALUES ?', [ptValues]);
    }
    await connection.commit();
    res.status(201).json({ player_id: playerId, player_name, role, nationality, sport_id });
  } catch (err) { 
    await connection.rollback();
    res.status(500).json({ message: err.message }); 
  } finally {
    connection.release();
  }
});

// PUT /api/players/:id
router.put('/:id', auth, async (req, res) => {
  const { player_name, role, nationality, team_ids, sport_id } = req.body;
  const playerId = req.params.id;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      'UPDATE PLAYER SET player_name=?, role=?, nationality=?, sport_id=? WHERE player_id=?',
      [player_name, role, nationality, sport_id || null, playerId]
    );
    await connection.query('DELETE FROM PLAYER_TEAM WHERE player_id=?', [playerId]);
    if (team_ids && Array.isArray(team_ids) && team_ids.length > 0) {
      const ptValues = team_ids.map(tid => [playerId, tid]);
      await connection.query('INSERT INTO PLAYER_TEAM (player_id, team_id) VALUES ?', [ptValues]);
    }
    await connection.commit();
    res.json({ message: 'Player updated' });
  } catch (err) { 
    await connection.rollback();
    res.status(500).json({ message: err.message }); 
  } finally {
    connection.release();
  }
});

// DELETE /api/players/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM PLAYER WHERE player_id=?', [req.params.id]);
    res.json({ message: 'Player deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
