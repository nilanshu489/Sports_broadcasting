const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [[{ total_players }]]     = await pool.query('SELECT COUNT(*) AS total_players FROM PLAYER');
    const [[{ total_teams }]]       = await pool.query('SELECT COUNT(*) AS total_teams FROM TEAM');
    const [[{ total_matches }]]     = await pool.query('SELECT COUNT(*) AS total_matches FROM MATCHES');
    const [[{ total_broadcasters }]]= await pool.query('SELECT COUNT(*) AS total_broadcasters FROM BROADCASTER');
    const [[{ total_stadiums }]]    = await pool.query('SELECT COUNT(*) AS total_stadiums FROM STADIUM');
    const [[{ total_sponsors }]]    = await pool.query('SELECT COUNT(*) AS total_sponsors FROM SPONSOR');

    // Matches per sport (via Tournament → Season → Match chain)
    const [matchesPerSport] = await pool.query(`
      SELECT sp.sport_name, COUNT(m.match_id) AS match_count
      FROM SPORT sp
      LEFT JOIN TOURNAMENT t  ON t.sport_id    = sp.sport_id
      LEFT JOIN SEASON     se ON se.tournament_id = t.tournament_id
      LEFT JOIN MATCHES    m  ON m.season_id   = se.season_id
      GROUP BY sp.sport_id, sp.sport_name
      ORDER BY match_count DESC
    `);

    // Recent matches
    const [recentMatches] = await pool.query(`
      SELECT m.match_id, m.match_date, m.match_status,
             s.stadium_name, se.season_year, t.tournament_name
      FROM MATCHES m
      LEFT JOIN STADIUM    s  ON m.stadium_id    = s.stadium_id
      LEFT JOIN SEASON     se ON m.season_id     = se.season_id
      LEFT JOIN TOURNAMENT t  ON se.tournament_id = t.tournament_id
      ORDER BY m.match_date DESC
      LIMIT 5
    `);

    res.json({
      total_players,
      total_teams,
      total_matches,
      total_broadcasters,
      total_stadiums,
      total_sponsors,
      matchesPerSport,
      recentMatches,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET global search across entities
router.get('/search', auth, async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query) return res.json([]);

    const likeQuery = `%${query}%`;
    const results = [];

    // Search Players
    const [players] = await pool.query('SELECT player_id as id, player_name as name, "player" as type FROM PLAYER WHERE player_name LIKE ? LIMIT 5', [likeQuery]);
    results.push(...players);

    // Search Teams
    const [teams] = await pool.query('SELECT team_id as id, team_name as name, "team" as type FROM TEAM WHERE team_name LIKE ? LIMIT 5', [likeQuery]);
    results.push(...teams);

    // Search Stadiums
    const [stadiums] = await pool.query('SELECT stadium_id as id, stadium_name as name, "stadium" as type FROM STADIUM WHERE stadium_name LIKE ? LIMIT 5', [likeQuery]);
    results.push(...stadiums);

    // Search Broadcasters
    const [broadcasters] = await pool.query('SELECT broadcaster_id as id, broadcaster_name as name, "broadcaster" as type FROM BROADCASTER WHERE broadcaster_name LIKE ? LIMIT 5', [likeQuery]);
    results.push(...broadcasters);

    // Search Sponsors
    const [sponsors] = await pool.query('SELECT sponsor_id as id, sponsor_name as name, "sponsor" as type FROM SPONSOR WHERE sponsor_name LIKE ? LIMIT 5', [likeQuery]);
    results.push(...sponsors);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
