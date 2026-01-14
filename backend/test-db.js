require('dotenv').config();
const mysql = require('mysql2/promise');

(async function(){
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flower_shop_db',
    waitForConnections: true,
    connectionLimit: 2
  });

  try {
    const [rows] = await pool.query('SELECT * FROM `province`');
    console.log('Connection OK:', rows);
    // optional: check branches table
    // const [branches] = await pool.query('SELECT id, name FROM branches LIMIT 5');
    // console.log('Branches sample:', branches);
  } catch (err) {
    console.error('DB test failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
