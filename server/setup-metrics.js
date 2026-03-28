const pool = require('./db');
require('dotenv').config();

const migrations = [
  `CREATE TABLE IF NOT EXISTS health_metrics (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    family_member_id INT REFERENCES family_members(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('water', 'steps', 'sleep')),
    value NUMERIC DEFAULT 0,
    unit VARCHAR(20),
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, family_member_id, metric_type, date)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_health_metrics_user_member ON health_metrics(user_id, family_member_id)`,
  `CREATE INDEX IF NOT EXISTS idx_health_metrics_date ON health_metrics(date)`
];

async function setupMetrics() {
  const client = await pool.connect();
  try {
    console.log('🔄 Criando tabela de métricas de saúde...');
    for (const stmt of migrations) {
      await client.query(stmt);
      console.log(`  ✓ ${stmt.trim().split('\n')[0].slice(0, 50)}...`);
    }
    console.log('\n✅ Tabela de métricas pronta!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupMetrics();
