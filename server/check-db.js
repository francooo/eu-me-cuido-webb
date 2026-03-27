const pool = require('./db');
require('dotenv').config();

async function checkDb() {
  const client = await pool.connect();
  try {
    // Verificar tabelas existentes
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('📋 Tabelas existentes:');
    tables.rows.forEach(r => console.log(`   - ${r.table_name}`));

    // Verificar colunas da tabela users se existir
    for (const { table_name } of tables.rows) {
      const cols = await client.query(`
        SELECT column_name, data_type FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [table_name]);
      console.log(`\n  Colunas de "${table_name}":`);
      cols.rows.forEach(c => console.log(`     ${c.column_name} (${c.data_type})`));
    }
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}
checkDb();
