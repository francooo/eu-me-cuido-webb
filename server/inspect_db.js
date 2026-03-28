const pool = require('./db');
async function check() {
  const res = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'family_members'");
  console.table(res.rows);
  process.exit();
}
check();
