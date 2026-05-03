const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET — with broadcaster name via JOIN
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, b.broadcaster_name
      FROM CHANNEL c
      LEFT JOIN BROADCASTER b ON c.broadcaster_id = b.broadcaster_id
      ORDER BY c.channel_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET channels by broadcaster
router.get('/by-broadcaster/:id', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM CHANNEL WHERE broadcaster_id = ?', [req.params.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { channel_name, language, broadcaster_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO CHANNEL (channel_name, language, broadcaster_id) VALUES (?, ?, ?)',
      [channel_name, language, broadcaster_id || null]
    );
    res.status(201).json({ channel_id: result.insertId, channel_name, language, broadcaster_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { channel_name, language, broadcaster_id } = req.body;
  try {
    await pool.query(
      'UPDATE CHANNEL SET channel_name=?, language=?, broadcaster_id=? WHERE channel_id=?',
      [channel_name, language, broadcaster_id || null, req.params.id]
    );
    res.json({ message: 'Channel updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM CHANNEL WHERE channel_id=?', [req.params.id]);
    res.json({ message: 'Channel deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
