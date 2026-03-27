const pool = require('./db');
require('dotenv').config();

// Alterações para adaptar as tabelas existentes ao nosso modelo
const migrations = [
  // Adicionar password_hash à tabela users se não existir
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)`,
  // Adicionar user_id à medications se não existir
  `ALTER TABLE medications ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE CASCADE`,
  // Adicionar colunas faltantes em medications
  `ALTER TABLE medications ADD COLUMN IF NOT EXISTS dosage VARCHAR(100)`,
  `ALTER TABLE medications ADD COLUMN IF NOT EXISTS frequency VARCHAR(100) DEFAULT 'daily'`,
  `ALTER TABLE medications ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 0`,
  `ALTER TABLE medications ADD COLUMN IF NOT EXISTS stock_total INT DEFAULT 30`,
  `ALTER TABLE medications ADD COLUMN IF NOT EXISTS icon VARCHAR(100) DEFAULT 'pill'`,
  `ALTER TABLE medications ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE`,
  `ALTER TABLE medications ADD COLUMN IF NOT EXISTS family_member_id INT`,
  // Adicionar user_id à family_members se nao existir
  `ALTER TABLE family_members ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE CASCADE`,
  `ALTER TABLE family_members ADD COLUMN IF NOT EXISTS is_self BOOLEAN DEFAULT FALSE`,
  `ALTER TABLE family_members ADD COLUMN IF NOT EXISTS relationship VARCHAR(100)`,
  // Criar nossas tabelas específicas se não existirem
  `CREATE TABLE IF NOT EXISTS dose_schedules (
    id SERIAL PRIMARY KEY,
    medication_id INT REFERENCES medications(id) ON DELETE CASCADE,
    scheduled_time TIME NOT NULL,
    days_of_week VARCHAR(50) DEFAULT 'daily',
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS dose_logs (
    id SERIAL PRIMARY KEY,
    medication_id INT REFERENCES medications(id) ON DELETE CASCADE,
    schedule_id INT REFERENCES dose_schedules(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('taken', 'missed', 'late')),
    scheduled_at TIMESTAMP NOT NULL,
    taken_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  // Índices
  `CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_dose_logs_medication_id ON dose_logs(medication_id)`,
  `CREATE INDEX IF NOT EXISTS idx_dose_logs_scheduled_at ON dose_logs(scheduled_at)`,
  `CREATE INDEX IF NOT EXISTS idx_dose_schedules_medication_id ON dose_schedules(medication_id)`,
  `CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id)`,
];

async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('🔄 Aplicando migrações ao banco existente...');
    for (const stmt of migrations) {
      try {
        await client.query(stmt);
        const preview = stmt.trim().split('\n')[0].slice(0, 70);
        console.log(`  ✓ ${preview}...`);
      } catch (err) {
        // Erros esperados (ex: restrição já existe) podem ser ignorados
        if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
          console.warn(`  ⚠ ${stmt.trim().slice(0, 60)}: ${err.message}`);
        } else {
          console.log(`  ↩ (já existe, ignorado)`);
        }
      }
    }
    console.log('\n✅ Migrações aplicadas com sucesso!');

    // Listar tabelas finais
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('\n📋 Tabelas no banco:');
    result.rows.forEach(row => console.log(`   ✓ ${row.table_name}`));

  } catch (err) {
    console.error('❌ Erro crítico:', err.message);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

setupDatabase();
