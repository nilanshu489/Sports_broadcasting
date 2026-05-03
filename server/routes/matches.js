const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/matches — JOIN with STADIUM and SEASON
router.get('/', auth, async (req, res) => {
  try {
    const { sport_id, level, tournament_id } = req.query;
    let query = `
      SELECT m.*,
             s.stadium_name, s.city AS stadium_city,
             se.season_year, se.tournament_id,
             t.tournament_name, t.tournament_level, t.sport_id
      FROM MATCHES m
      LEFT JOIN STADIUM s  ON m.stadium_id  = s.stadium_id
      LEFT JOIN SEASON  se ON m.season_id   = se.season_id
      LEFT JOIN TOURNAMENT t ON se.tournament_id = t.tournament_id
      WHERE 1=1
    `;
    const params = [];
    if (sport_id) { query += ' AND t.sport_id = ?'; params.push(sport_id); }
    if (level) { query += ' AND t.tournament_level = ?'; params.push(level); }
    if (tournament_id) { query += ' AND t.tournament_id = ?'; params.push(tournament_id); }
    
    query += ' ORDER BY m.match_date DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/matches — uses TRANSACTION to also create broadcast_schedule slot
router.post('/', auth, async (req, res) => {
  const { match_date, start_time, match_status, season_id, stadium_id, broadcaster_id, end_time } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert match
    const [matchResult] = await conn.query(
      'INSERT INTO MATCHES (match_date, start_time, match_status, season_id, stadium_id) VALUES (?, ?, ?, ?, ?)',
      [match_date, start_time, match_status || 'Scheduled', season_id || null, stadium_id || null]
    );
    const match_id = matchResult.insertId;

    // If broadcaster provided, insert schedule entry
    if (broadcaster_id) {
      await conn.query(
        'INSERT INTO BROADCAST_SCHEDULE (start_time, end_time, broadcaster_id, match_id) VALUES (?, ?, ?, ?)',
        [start_time, end_time || null, broadcaster_id, match_id]
      );
    }

    await conn.commit();
    res.status(201).json({ match_id, message: 'Match and schedule created' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
});

// PUT /api/matches/:id — uses SELECT FOR UPDATE for concurrency control
router.put('/:id', auth, async (req, res) => {
  const { match_date, start_time, match_status, season_id, stadium_id } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Lock row to prevent concurrent updates
    await conn.query('SELECT match_id FROM MATCHES WHERE match_id = ? FOR UPDATE', [req.params.id]);
    await conn.query(
      'UPDATE MATCHES SET match_date=?, start_time=?, match_status=?, season_id=?, stadium_id=? WHERE match_id=?',
      [match_date, start_time, match_status, season_id || null, stadium_id || null, req.params.id]
    );
    await conn.commit();
    res.json({ message: 'Match updated' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
});

// DELETE /api/matches/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM MATCHES WHERE match_id=?', [req.params.id]);
    res.json({ message: 'Match deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
