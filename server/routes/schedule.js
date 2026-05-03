const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET schedule with JOINs
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT bs.*,
             b.broadcaster_name,
             m.match_date, m.match_status,
             s.stadium_name
      FROM BROADCAST_SCHEDULE bs
      LEFT JOIN BROADCASTER b ON bs.broadcaster_id = b.broadcaster_id
      LEFT JOIN MATCHES      m ON bs.match_id       = m.match_id
      LEFT JOIN STADIUM      s ON m.stadium_id      = s.stadium_id
      ORDER BY m.match_date DESC, bs.start_time ASC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { start_time, end_time, broadcaster_id, match_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO BROADCAST_SCHEDULE (start_time, end_time, broadcaster_id, match_id) VALUES (?, ?, ?, ?)',
      [start_time, end_time, broadcaster_id || null, match_id || null]
    );
    res.status(201).json({ schedule_id: result.insertId, start_time, end_time, broadcaster_id, match_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { start_time, end_time, broadcaster_id, match_id } = req.body;
  try {
    await pool.query(
      'UPDATE BROADCAST_SCHEDULE SET start_time=?, end_time=?, broadcaster_id=?, match_id=? WHERE schedule_id=?',
      [start_time, end_time, broadcaster_id || null, match_id || null, req.params.id]
    );
    res.json({ message: 'Schedule updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM BROADCAST_SCHEDULE WHERE schedule_id=?', [req.params.id]);
    res.json({ message: 'Schedule entry deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
