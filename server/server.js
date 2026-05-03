const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/players',     require('./routes/players'));
app.use('/api/teams',       require('./routes/teams'));
app.use('/api/matches',     require('./routes/matches'));
app.use('/api/stadiums',    require('./routes/stadiums'));
app.use('/api/broadcasters',require('./routes/broadcasters'));
app.use('/api/channels',    require('./routes/channels'));
app.use('/api/sponsors',    require('./routes/sponsors'));
app.use('/api/media-rights',require('./routes/mediaRights'));
app.use('/api/schedule',    require('./routes/schedule'));
app.use('/api/sports',      require('./routes/sports'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/seasons',     require('./routes/seasons'));
app.use('/api/dashboard',   require('./routes/dashboard'));

// Root route
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>🚀 Sports Broadcasting API is Running</h1>
            <p>The backend server is active on port ${process.env.PORT || 5000}.</p>
            <p>To view the dashboard, please visit the frontend at <a href="http://localhost:5173">http://localhost:5173</a>.</p>
            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 5px; display: inline-block;">
                <strong>Health Status:</strong> /api/health → <a href="/api/health">Check</a>
            </div>
        </div>
    `);
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// ==========================================
// Auto Match Status Updater (Scheduled → Live)
// ==========================================
// Every 30 seconds, check if any 'Scheduled' match's date+time has arrived.
// If so, automatically update its status to 'Live'.
setInterval(async () => {
  try {
    const [result] = await pool.query(`
      UPDATE MATCHES 
      SET match_status = 'Live' 
      WHERE match_status = 'Scheduled' 
        AND CONCAT(match_date, ' ', start_time) <= NOW()
    `);
    if (result.affectedRows > 0) {
      console.log(`🔴 ${result.affectedRows} match(es) went LIVE automatically!`);
    }
  } catch (err) {
    console.error('Auto Status Update Error:', err.message);
  }
}, 30000); // Check every 30 seconds

// ==========================================
// Live Score Simulator (for demo purposes)
// ==========================================
// Randomly increments scores for matches that are currently 'Live' every 15 seconds.
setInterval(async () => {
  try {
    await pool.query(`
      UPDATE MATCHES 
      SET home_score = home_score + FLOOR(RAND() * 3), 
          away_score = away_score + FLOOR(RAND() * 3) 
      WHERE match_status = 'Live'
    `);
  } catch (err) {
    console.error('Live Simulator Error:', err.message);
  }
}, 15000);
