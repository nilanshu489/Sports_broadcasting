const pool = require('./config/db');

async function updatePassword() {
  const newHash = '$2a$10$zsbk/dz1IPsHk3qmhAJLIuUSFpFzeIe/nHieELFZs9U.qoX.6vNyK';
  try {
    await pool.query('UPDATE ADMIN SET password_hash = ? WHERE username = ?', [newHash, 'admin']);
    console.log('Admin password updated successfully');
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

updatePassword();
