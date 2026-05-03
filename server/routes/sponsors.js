const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET all sponsors
router.get('/', auth, async (req, res) => {
  try {
    const { sport_id } = req.query;
    let query = 'SELECT * FROM SPONSOR WHERE 1=1';
    const params = [];
    if (sport_id) { query += ' AND sport_id = ?'; params.push(sport_id); }
    query += ' ORDER BY sponsor_id DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST sponsor
router.post('/', auth, async (req, res) => {
  const { sponsor_name, industry_type, sport_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO SPONSOR (sponsor_name, industry_type, sport_id) VALUES (?, ?, ?)',
      [sponsor_name, industry_type, sport_id || null]
    );
    res.status(201).json({ sponsor_id: result.insertId, sponsor_name, industry_type, sport_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT sponsor
router.put('/:id', auth, async (req, res) => {
  const { sponsor_name, industry_type, sport_id } = req.body;
  try {
    await pool.query(
      'UPDATE SPONSOR SET sponsor_name=?, industry_type=?, sport_id=? WHERE sponsor_id=?',
      [sponsor_name, industry_type, sport_id || null, req.params.id]
    );
    res.json({ message: 'Sponsor updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE sponsor
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM SPONSOR WHERE sponsor_id=?', [req.params.id]);
    res.json({ message: 'Sponsor deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET sponsor-tournament associations (with names)
router.get('/tournaments', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT st.sponsor_id, st.tournament_id,
             s.sponsor_name, s.industry_type,
             t.tournament_name
      FROM SPONSOR_TOURNAMENT st
      JOIN SPONSOR     s ON st.sponsor_id    = s.sponsor_id
      JOIN TOURNAMENT  t ON st.tournament_id = t.tournament_id
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST sponsor-tournament link
router.post('/tournaments', auth, async (req, res) => {
  const { sponsor_id, tournament_id } = req.body;
  try {
    await pool.query(
      'INSERT IGNORE INTO SPONSOR_TOURNAMENT (sponsor_id, tournament_id) VALUES (?, ?)',
      [sponsor_id, tournament_id]
    );
    res.status(201).json({ message: 'Sponsor linked to tournament' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE sponsor-tournament link
router.delete('/tournaments/:sponsor_id/:tournament_id', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM SPONSOR_TOURNAMENT WHERE sponsor_id=? AND tournament_id=?',
      [req.params.sponsor_id, req.params.tournament_id]
    );
    res.json({ message: 'Link removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
