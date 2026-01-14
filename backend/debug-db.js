require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flower_shop_db',
  });

  try {
    console.log('📝 ตรวจสอบการเชื่อมต่อ MySQL...');
    const conn = await pool.getConnection();
    console.log('✅ เชื่อมต่อสำเร็จ!');

    // ตรวจสอบตาราทั้งหมด
    console.log('\n📋 ตารางในฐานข้อมูล:');
    const [tables] = await conn.query(`SHOW TABLES`);
    tables.forEach((row) => {
      const tableName = Object.values(row)[0];
      console.log(`  - ${tableName}`);
    });

    // ลอง query region
    console.log('\n🔍 ลองดึง region:');
    try {
      const [rows] = await conn.query(`SELECT * FROM region LIMIT 5`);
      console.log(`✅ พบ ${rows.length} แถว:`);
      console.log(rows);
    } catch (e) {
      console.log(`❌ Error: ${e.message}`);
      console.log('💡 ลองตรวจสอบชื่อตารางในฐานข้อมูล');
    }

    conn.release();
  } catch (err) {
    console.error('❌ ข้อผิดพลาด:', err.message);
    console.log('\n💡 ตรวจสอบ:');
    console.log(`  1. MySQL เปิดอยู่หรือไม่?`);
    console.log(`  2. ค่า .env ถูกต้องหรือไม่? (host, user, password, database)`);
    console.log(`  3. ฐานข้อมูล "${process.env.DB_NAME || 'flower_shop_db'}" มีอยู่หรือไม่?`);
  } finally {
    await pool.end();
  }
})();
