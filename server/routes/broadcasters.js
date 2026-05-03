const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET — with channel count
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, COUNT(c.channel_id) AS channel_count
      FROM BROADCASTER b
      LEFT JOIN CHANNEL c ON b.broadcaster_id = c.broadcaster_id
      GROUP BY b.broadcaster_id
      ORDER BY b.broadcaster_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { broadcaster_name, country, contact_email } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO BROADCASTER (broadcaster_name, country, contact_email) VALUES (?, ?, ?)',
      [broadcaster_name, country, contact_email]
    );
    res.status(201).json({ broadcaster_id: result.insertId, broadcaster_name, country, contact_email });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { broadcaster_name, country, contact_email } = req.body;
  try {
    await pool.query(
      'UPDATE BROADCASTER SET broadcaster_name=?, country=?, contact_email=? WHERE broadcaster_id=?',
      [broadcaster_name, country, contact_email, req.params.id]
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
