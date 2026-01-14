require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flower_shop_db',
  });
  const conn = await pool.getConnection();
  try {
    const [tables] = await conn.query("SHOW TABLES");
    const tableNames = tables.map(r => Object.values(r)[0]);
    for (const t of tableNames) {
      console.log('\nTABLE: ' + t);
      try {
        const [cols] = await conn.query('DESCRIBE `' + t + '`');
        cols.forEach(c => {
          console.log(`  - ${c.Field} \t ${c.Type} \t ${c.Null} \t ${c.Key} \t ${c.Default} \t ${c.Extra}`);
        });
      } catch (e) {
        console.error('  ❌ DESCRIBE failed for', t, e.message);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    conn.release();
    await pool.end();
  }
})();