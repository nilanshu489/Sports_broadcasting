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
// Live Score Simulator
// ==========================================
// Randomly increments scores for matches that are currently 'Live' every 5 seconds.
setInterval(async () => {
  try {
    // Increment score by 0, 1, or 2 randomly for live matches
    await pool.query(`
      UPDATE MATCHES 
      SET home_score = home_score + FLOOR(RAND() * 3), 
          away_score = away_score + FLOOR(RAND() * 3) 
      WHERE match_status = 'Live'
    `);
  } catch (err) {
    console.error('Live Simulator Error:', err.message);
  }
}, 5000);
