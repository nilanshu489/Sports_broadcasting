const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM STADIUM ORDER BY stadium_id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { stadium_name, city, capacity } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO STADIUM (stadium_name, city, capacity) VALUES (?, ?, ?)',
      [stadium_name, city, capacity]
    );
    res.status(201).json({ stadium_id: result.insertId, stadium_name, city, capacity });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { stadium_name, city, capacity } = req.body;
  try {
    await pool.query(
      'UPDATE STADIUM SET stadium_name=?, city=?, capacity=? WHERE stadium_id=?',
      [stadium_name, city, capacity, req.params.id]
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
