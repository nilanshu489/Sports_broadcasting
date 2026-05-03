const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET dashboard stats (enhanced analytics)
router.get('/stats', auth, async (req, res) => {
  try {
    const [[{ total_players }]]     = await pool.query('SELECT COUNT(*) AS total_players FROM PLAYER');
    const [[{ total_teams }]]       = await pool.query('SELECT COUNT(*) AS total_teams FROM TEAM');
    const [[{ total_matches }]]     = await pool.query('SELECT COUNT(*) AS total_matches FROM MATCHES');
    const [[{ total_broadcasters }]]= await pool.query('SELECT COUNT(*) AS total_broadcasters FROM BROADCASTER');
    const [[{ total_stadiums }]]    = await pool.query('SELECT COUNT(*) AS total_stadiums FROM STADIUM');
    const [[{ total_sponsors }]]    = await pool.query('SELECT COUNT(*) AS total_sponsors FROM SPONSOR');
    const [[{ live_matches }]]      = await pool.query("SELECT COUNT(*) AS live_matches FROM MATCHES WHERE match_status = 'Live'");

    // 1. Matches per sport
    const [matchesPerSport] = await pool.query(`
      SELECT sp.sport_name, COUNT(m.match_id) AS match_count
      FROM SPORT sp
      LEFT JOIN TOURNAMENT t  ON t.sport_id    = sp.sport_id
      LEFT JOIN SEASON     se ON se.tournament_id = t.tournament_id
      LEFT JOIN MATCHES    m  ON m.season_id   = se.season_id
      GROUP BY sp.sport_id, sp.sport_name
      ORDER BY match_count DESC
    `);

    // 2. Players per sport
    const [playersPerSport] = await pool.query(`
      SELECT sp.sport_name, COUNT(p.player_id) AS player_count
      FROM SPORT sp
      LEFT JOIN PLAYER p ON p.sport_id = sp.sport_id
      GROUP BY sp.sport_id, sp.sport_name
      ORDER BY player_count DESC
    `);

    // 3. Teams by level (International / Franchise / National)
    const [teamsByLevel] = await pool.query(`
      SELECT team_level, COUNT(*) AS team_count
      FROM TEAM
      GROUP BY team_level
      ORDER BY team_count DESC
    `);

    // 4. Match status breakdown
    const [matchStatusBreakdown] = await pool.query(`
      SELECT match_status, COUNT(*) AS status_count
      FROM MATCHES
      GROUP BY match_status
      ORDER BY status_count DESC
    `);

    // 5. Top 10 stadiums by capacity
    const [topStadiums] = await pool.query(`
      SELECT stadium_name, capacity
      FROM STADIUM
      ORDER BY capacity DESC
      LIMIT 10
    `);

    // 6. Sponsors per sport
    const [sponsorsPerSport] = await pool.query(`
      SELECT sp.sport_name, COUNT(s.sponsor_id) AS sponsor_count
      FROM SPORT sp
      LEFT JOIN SPONSOR s ON s.sport_id = sp.sport_id
      GROUP BY sp.sport_id, sp.sport_name
      ORDER BY sponsor_count DESC
    `);

    // 7. Recent matches (with team names)
    const [recentMatches] = await pool.query(`
      SELECT m.match_id, m.match_date, m.match_status, m.home_score, m.away_score, m.stream_url,
             s.stadium_name, se.season_year, t.tournament_name,
             ht.team_name as home_team_name,
             at2.team_name as away_team_name
      FROM MATCHES m
      LEFT JOIN STADIUM    s   ON m.stadium_id    = s.stadium_id
      LEFT JOIN SEASON     se  ON m.season_id     = se.season_id
      LEFT JOIN TOURNAMENT t   ON se.tournament_id = t.tournament_id
      LEFT JOIN TEAM       ht  ON m.home_team_id  = ht.team_id
      LEFT JOIN TEAM       at2 ON m.away_team_id  = at2.team_id
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
      live_matches,
      matchesPerSport,
      playersPerSport,
      teamsByLevel,
      matchStatusBreakdown,
      topStadiums,
      sponsorsPerSport,
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

