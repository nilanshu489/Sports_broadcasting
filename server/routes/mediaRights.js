const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET all media rights with JOIN
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT mr.*, b.broadcaster_name, t.tournament_name
      FROM MEDIA_RIGHTS mr
      LEFT JOIN BROADCASTER b ON mr.broadcaster_id = b.broadcaster_id
      LEFT JOIN TOURNAMENT  t ON mr.tournament_id  = t.tournament_id
      ORDER BY mr.rights_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { rights_fee, broadcaster_id, tournament_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO MEDIA_RIGHTS (rights_fee, broadcaster_id, tournament_id) VALUES (?, ?, ?)',
      [rights_fee, broadcaster_id || null, tournament_id || null]
    );
    res.status(201).json({ rights_id: result.insertId, rights_fee, broadcaster_id, tournament_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  const { rights_fee, broadcaster_id, tournament_id } = req.body;
  try {
    await pool.query(
      'UPDATE MEDIA_RIGHTS SET rights_fee=?, broadcaster_id=?, tournament_id=? WHERE rights_id=?',
      [rights_fee, broadcaster_id || null, tournament_id || null, req.params.id]
    );
    res.json({ message: 'Media rights updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM MEDIA_RIGHTS WHERE rights_id=?', [req.params.id]);
    res.json({ message: 'Media rights deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
