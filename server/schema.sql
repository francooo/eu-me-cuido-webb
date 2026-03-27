-- ============================================
-- EU ME CUIDO — Schema do Banco de Dados Neon
-- ============================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Membros da Família
CREATE TABLE IF NOT EXISTS family_members (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100),
  is_self BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Medicamentos
CREATE TABLE IF NOT EXISTS medications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  family_member_id INT REFERENCES family_members(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100) DEFAULT 'daily',
  stock_quantity INT DEFAULT 0,
  stock_total INT DEFAULT 30,
  icon VARCHAR(100) DEFAULT 'pill',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agendamentos de Dose
CREATE TABLE IF NOT EXISTS dose_schedules (
  id SERIAL PRIMARY KEY,
  medication_id INT REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_time TIME NOT NULL,
  days_of_week VARCHAR(50) DEFAULT 'daily',
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Histórico de Doses
CREATE TABLE IF NOT EXISTS dose_logs (
  id SERIAL PRIMARY KEY,
  medication_id INT REFERENCES medications(id) ON DELETE CASCADE,
  schedule_id INT REFERENCES dose_schedules(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('taken', 'missed', 'late')),
  scheduled_at TIMESTAMP NOT NULL,
  taken_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);
CREATE INDEX IF NOT EXISTS idx_dose_logs_medication_id ON dose_logs(medication_id);
CREATE INDEX IF NOT EXISTS idx_dose_logs_scheduled_at ON dose_logs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_dose_schedules_medication_id ON dose_schedules(medication_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
