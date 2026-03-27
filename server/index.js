const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'eumecuido_secret';

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());

// ─── Middleware de Autenticação JWT ──────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/auth/signup — cadastrar novo usuário
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Preencha todos os campos' });

  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0)
      return res.status(409).json({ error: 'E-mail já cadastrado' });

    const password_hash = await bcrypt.hash(password, 10);
    // Tenta inserir com password_hash, se falhar usa password
    let result;
    try {
      result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, password_hash]
      );
    } catch {
      result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, password_hash]
      );
    }
    const user = result.rows[0];

    // Criar membro da família "self" automático
    try {
      await pool.query(
        'INSERT INTO family_members (user_id, name, relationship, is_self) VALUES ($1, $2, $3, TRUE)',
        [user.id, name, 'Eu']
      );
    } catch {
      // family_members pode ter estrutura diferente, ignorar erro
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login — login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Credenciais inválidas' });

    const user = result.rows[0];
    // Suporta tanto password_hash quanto password (coluna legada)
    const storedHash = user.password_hash || user.password;
    if (!storedHash) return res.status(401).json({ error: 'Credenciais inválidas' });
    const valid = await bcrypt.compare(password, storedHash);
    if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name || user.first_name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me — dados do usuário logado
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// FAMILY MEMBERS ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/family-members
app.get('/api/family-members', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM family_members WHERE user_id = $1 ORDER BY is_self DESC, name ASC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/family-members
app.post('/api/family-members', authMiddleware, async (req, res) => {
  const { name, relationship } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });
  try {
    const result = await pool.query(
      'INSERT INTO family_members (user_id, name, relationship) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, name, relationship || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/family-members/:id
app.delete('/api/family-members/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM family_members WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Membro removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEDICATIONS ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/medications
app.get('/api/medications', authMiddleware, async (req, res) => {
  try {
    const { family_member_id } = req.query;
    let query = `
      SELECT m.*, fm.name as family_member_name,
             ds.scheduled_time as next_dose_time
      FROM medications m
      LEFT JOIN family_members fm ON m.family_member_id = fm.id
      LEFT JOIN dose_schedules ds ON ds.medication_id = m.id
      WHERE m.user_id = $1 AND m.active = TRUE
    `;
    const params = [req.userId];

    if (family_member_id) {
      query += ' AND m.family_member_id = $2';
      params.push(family_member_id);
    }

    query += ' ORDER BY m.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/medications
app.post('/api/medications', authMiddleware, async (req, res) => {
  const { name, dosage, frequency, stock_quantity, stock_total, icon, family_member_id, scheduled_time, instructions } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome do medicamento é obrigatório' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const medResult = await client.query(
      `INSERT INTO medications (user_id, family_member_id, name, dosage, frequency, stock_quantity, stock_total, icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.userId, family_member_id || null, name, dosage || '', frequency || 'daily',
       stock_quantity || 0, stock_total || 30, icon || 'pill']
    );
    const med = medResult.rows[0];

    if (scheduled_time) {
      await client.query(
        'INSERT INTO dose_schedules (medication_id, scheduled_time, instructions) VALUES ($1, $2, $3)',
        [med.id, scheduled_time, instructions || '']
      );
    }

    await client.query('COMMIT');
    res.status(201).json(med);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT /api/medications/:id
app.put('/api/medications/:id', authMiddleware, async (req, res) => {
  const { name, dosage, frequency, stock_quantity, stock_total, icon } = req.body;
  try {
    const result = await pool.query(
      `UPDATE medications SET name=$1, dosage=$2, frequency=$3, stock_quantity=$4,
       stock_total=$5, icon=$6 WHERE id=$7 AND user_id=$8 RETURNING *`,
      [name, dosage, frequency, stock_quantity, stock_total, icon, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Medicamento não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/medications/:id
app.delete('/api/medications/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE medications SET active=FALSE WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
    res.json({ message: 'Medicamento removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DOSE SCHEDULES ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/dose-schedules — agenda de hoje
app.get('/api/dose-schedules', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ds.*, m.name as medication_name, m.dosage, m.icon
       FROM dose_schedules ds
       JOIN medications m ON ds.medication_id = m.id
       WHERE m.user_id = $1 AND m.active = TRUE
       ORDER BY ds.scheduled_time ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DOSE LOGS ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/dose-logs
app.get('/api/dose-logs', authMiddleware, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const result = await pool.query(
      `SELECT dl.*, m.name as medication_name, m.dosage, m.icon
       FROM dose_logs dl
       JOIN medications m ON dl.medication_id = m.id
       WHERE m.user_id = $1
         AND dl.scheduled_at >= NOW() - INTERVAL '${parseInt(days)} days'
       ORDER BY dl.scheduled_at DESC
       LIMIT 100`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dose-logs — registrar dose
app.post('/api/dose-logs', authMiddleware, async (req, res) => {
  const { medication_id, schedule_id, status, scheduled_at, notes } = req.body;
  if (!medication_id || !status || !scheduled_at)
    return res.status(400).json({ error: 'medication_id, status e scheduled_at são obrigatórios' });

  try {
    const taken_at = status === 'taken' ? new Date().toISOString() : null;
    const result = await pool.query(
      `INSERT INTO dose_logs (medication_id, schedule_id, status, scheduled_at, taken_at, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [medication_id, schedule_id || null, status, scheduled_at, taken_at, notes || null]
    );

    // Atualizar estoque se tomou
    if (status === 'taken') {
      await pool.query(
        'UPDATE medications SET stock_quantity = GREATEST(0, stock_quantity - 1) WHERE id = $1 AND user_id = $2',
        [medication_id, req.userId]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD ROUTE
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/dashboard — resumo para o dashboard
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    // Total de medicamentos ativos
    const medsResult = await pool.query(
      'SELECT COUNT(*) as total FROM medications WHERE user_id = $1 AND active = TRUE',
      [req.userId]
    );

    // Doses de hoje
    const todayLogsResult = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'taken') as taken,
         COUNT(*) FILTER (WHERE status = 'missed') as missed,
         COUNT(*) as total
       FROM dose_logs dl
       JOIN medications m ON dl.medication_id = m.id
       WHERE m.user_id = $1
         AND dl.scheduled_at::date = CURRENT_DATE`,
      [req.userId]
    );

    // Medicamentos com estoque crítico (< 20% do total)
    const criticalResult = await pool.query(
      `SELECT COUNT(*) as total FROM medications
       WHERE user_id = $1 AND active = TRUE
         AND stock_quantity < (stock_total * 0.2)`,
      [req.userId]
    );

    // Próximas doses
    const nextDosesResult = await pool.query(
      `SELECT ds.scheduled_time, m.name, m.dosage, m.icon
       FROM dose_schedules ds
       JOIN medications m ON ds.medication_id = m.id
       WHERE m.user_id = $1 AND m.active = TRUE
         AND ds.scheduled_time > CURRENT_TIME
       ORDER BY ds.scheduled_time ASC
       LIMIT 3`,
      [req.userId]
    );

    // Prescrições ativas com estoque
    const prescriptionsResult = await pool.query(
      `SELECT m.*, ds.scheduled_time
       FROM medications m
       LEFT JOIN dose_schedules ds ON ds.medication_id = m.id
       WHERE m.user_id = $1 AND m.active = TRUE
       ORDER BY m.stock_quantity ASC
       LIMIT 6`,
      [req.userId]
    );

    const today = todayLogsResult.rows[0];
    res.json({
      medications_total: parseInt(medsResult.rows[0].total),
      today: {
        taken: parseInt(today.taken),
        missed: parseInt(today.missed),
        total: parseInt(today.total),
        progress: today.total > 0 ? Math.round((today.taken / today.total) * 100) : 0,
      },
      critical_stock: parseInt(criticalResult.rows[0].total),
      next_doses: nextDosesResult.rows,
      prescriptions: prescriptionsResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Banco de dados: Neon PostgreSQL`);
});
