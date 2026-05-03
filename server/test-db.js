const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT * FROM ADMIN WHERE username = ?', ['admin']);
    console.log('Admin user found:', rows.length > 0);
    if (rows.length > 0) {
      const admin = rows[0];
      const valid = await bcrypt.compare('admin123', admin.password_hash);
      console.log('Password valid:', valid);
    }
    
    // Test stats query
    const [[{ total_players }]] = await pool.query('SELECT COUNT(*) AS total_players FROM PLAYER');
    console.log('Total players:', total_players);
    
    process.exit(0);
  } catch (err) {
    console.error('Connection test failed:', err);
    process.exit(1);
  }
}

testConnection();
