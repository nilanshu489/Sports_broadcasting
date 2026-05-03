const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { sport_id } = req.query;
    let query = 'SELECT * FROM STADIUM WHERE 1=1';
    const params = [];
    if (sport_id) { query += ' AND sport_id = ?'; params.push(sport_id); }
    query += ' ORDER BY stadium_id DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { stadium_name, city, capacity, sport_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO STADIUM (stadium_name, city, capacity, sport_id) VALUES (?, ?, ?, ?)',
      [stadium_name, city, capacity || null, sport_id || null]
    );
    res.status(201).json({ stadium_id: result.insertId, stadium_name, city, capacity, sport_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { stadium_name, city, capacity, sport_id } = req.body;
  try {
    await pool.query(
      'UPDATE STADIUM SET stadium_name=?, city=?, capacity=?, sport_id=? WHERE stadium_id=?',
      [stadium_name, city, capacity || null, sport_id || null, req.params.id]
    );
    res.json({ message: 'Stadium updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM STADIUM WHERE stadium_id=?', [req.params.id]);
    res.json({ message: 'Stadium deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
