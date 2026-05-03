const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET — with channel count
router.get('/', auth, async (req, res) => {
  try {
    const { sport_id } = req.query;
    let query = `
      SELECT b.*, COUNT(c.channel_id) as channel_count
      FROM BROADCASTER b
      LEFT JOIN CHANNEL c ON b.broadcaster_id = c.broadcaster_id
      WHERE 1=1
    `;
    const params = [];
    if (sport_id) { query += ' AND b.sport_id = ?'; params.push(sport_id); }
    query += `
      GROUP BY b.broadcaster_id
      ORDER BY b.broadcaster_name
    `;
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { broadcaster_name, country, contact_email, sport_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO BROADCASTER (broadcaster_name, country, contact_email, sport_id) VALUES (?, ?, ?, ?)',
      [broadcaster_name, country, contact_email, sport_id || null]
    );
    res.status(201).json({ broadcaster_id: result.insertId, broadcaster_name, country, contact_email, sport_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { broadcaster_name, country, contact_email, sport_id } = req.body;
  try {
    await pool.query(
      'UPDATE BROADCASTER SET broadcaster_name=?, country=?, contact_email=?, sport_id=? WHERE broadcaster_id=?',
      [broadcaster_name, country, contact_email, sport_id || null, req.params.id]
    );
    res.json({ message: 'Broadcaster updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM BROADCASTER WHERE broadcaster_id=?', [req.params.id]);
    res.json({ message: 'Broadcaster deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
