const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log("⏳ Connecting to MySQL server...");
  try {
    // Connect without specifying the database first, so we can create it!
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true // Allows running an entire SQL file at once
    });

    console.log("✅ Connected! Reading SQL files...");
    
    // Read the SQL files
    const schemaSql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf-8');
    const seedSql = fs.readFileSync(path.join(__dirname, '../seed.sql'), 'utf-8');

    console.log("🛠️  Running schema.sql (Creating tables)...");
    await connection.query(schemaSql);

    console.log("🌱 Running seed.sql (Inserting dummy data)...");
    await connection.query(seedSql);

    console.log("🎉 Success! Your database is fully set up and populated.");
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
