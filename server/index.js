const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configuração do Multer para uploads de avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/avatars/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Apenas imagens JPG/PNG são permitidas'));
  }
});


const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'eumecuido_secret';

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Middleware de log para depuração
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});


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
        'INSERT INTO family_members (user_id, name, relation, relationship, is_self, created_at, created_by_user_id, family_id, is_active) VALUES ($1, $2, $3, $4, TRUE, NOW(), $1, $1, TRUE)',
        [user.id, name, 'Eu', 'Eu']
      );
    } catch (err) {
      console.error('Falha ao criar self-member:', err.message);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Erro no signup:', err);
    res.status(500).json({ error: 'Erro ao criar usuário', detail: err.message });
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
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
});

// GET /api/auth/me — dados do usuário logado
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro em /auth/me:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
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
    console.error('Erro ao listar família:', err);
    res.status(500).json({ error: 'Erro ao buscar membros da família' });
  }
});

// POST /api/family-members
app.post('/api/family-members', authMiddleware, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'A imagem deve ter no máximo 5MB' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  const { name, relation, birth_date, gender } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  // Normalizar birth_date (DD/MM/YYYY para YYYY-MM-DD se necessário)
  let normalizedDate = birth_date || null;
  if (normalizedDate && normalizedDate.includes('/')) {
    const [day, month, year] = normalizedDate.split('/');
    normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const avatar_url = req.file ? `/uploads/avatars/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO family_members (
        user_id, name, relation, relationship, birth_date, gender, avatar_url, 
        created_at, created_by_user_id, family_id, is_active
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $1, 1, TRUE) RETURNING *`,
      [req.userId, name, relation || 'Outro', relation || 'Outro', normalizedDate, gender || null, avatar_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar membro da família:', err);
    res.status(500).json({ 
      error: 'Erro ao criar membro',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// DELETE /api/family-members/:id
app.delete('/api/family-members/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM family_members WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Membro removido' });
  } catch (err) {
    console.error('Erro ao remover membro:', err);
    res.status(500).json({ error: 'Erro ao remover membro' });
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
    console.error('Erro ao listar medicamentos:', err);
    res.status(500).json({ error: 'Erro ao buscar medicamentos' });
  }
});

// POST /api/medications
app.post('/api/medications', authMiddleware, async (req, res) => {
  const { name, dosage, frequency, stock_quantity, stock_total, icon, family_member_id, scheduled_time, instructions } = req.body;
  console.log('--- POST /api/medications ---');
  console.log('Body:', JSON.stringify(req.body, null, 2));

  if (!name) return res.status(400).json({ error: 'Nome do medicamento é obrigatório' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const medType = icon || 'pill';
    const medResult = await client.query(
      `INSERT INTO medications (user_id, family_member_id, name, dosage, frequency, stock_quantity, stock_total, icon, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'pill')) RETURNING *`,
      [req.userId, family_member_id || null, name, dosage || '', frequency || 'daily',
       stock_quantity || 0, stock_total || 30, icon || 'pill', medType]
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
    console.error('Erro ao criar medicamento:', err);
    res.status(500).json({ error: 'Erro ao cadastrar medicamento' });
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
       stock_total=$5, icon=$6, type=$7 WHERE id=$8 AND user_id=$9 RETURNING *`,
      [name, dosage, frequency, stock_quantity, stock_total, icon, icon, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Medicamento não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar medicamento:', err);
    res.status(500).json({ error: 'Erro ao atualizar dados' });
  }
});

// DELETE /api/medications/:id
app.delete('/api/medications/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE medications SET active=FALSE WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
    res.json({ message: 'Medicamento removido' });
  } catch (err) {
    console.error('Erro ao remover medicamento:', err);
    res.status(500).json({ error: 'Erro ao remover' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DOSE SCHEDULES ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/dose-schedules — agenda de hoje
app.get('/api/dose-schedules', authMiddleware, async (req, res) => {
  try {
    const { family_member_id } = req.query;
    let query = `
      SELECT ds.*, m.name as medication_name, m.dosage, m.icon
      FROM dose_schedules ds
      JOIN medications m ON ds.medication_id = m.id
      WHERE m.user_id = $1 AND m.active = TRUE
    `;
    const params = [req.userId];
    if (family_member_id) {
      query += ' AND m.family_member_id = $2';
      params.push(family_member_id);
    }
    query += ' ORDER BY ds.scheduled_time ASC';
    const result = await pool.query(query, params);
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
    const { days = 7, family_member_id } = req.query;
    let query = `
      SELECT dl.*, m.name as medication_name, m.dosage, m.icon
      FROM dose_logs dl
      JOIN medications m ON dl.medication_id = m.id
      WHERE m.user_id = $1
    `;
    const params = [req.userId];
    if (family_member_id) {
      query += ' AND m.family_member_id = $2';
      params.push(family_member_id);
    }
    query += ` AND dl.scheduled_at >= NOW() - INTERVAL '${parseInt(days)} days' ORDER BY dl.scheduled_at DESC LIMIT 100`;
    
    const result = await pool.query(query, params);
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
    console.error('Erro ao registrar dose:', err);
    res.status(500).json({ error: 'Erro ao salvar registro' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD ROUTE
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/dashboard — resumo para o dashboard
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const { family_member_id } = req.query;
    const params = [req.userId];
    const memberFilter = family_member_id ? ' AND m.family_member_id = $2' : '';
    if (family_member_id) params.push(family_member_id);

    // Total de medicamentos ativos
    const medsResult = await pool.query(
      `SELECT COUNT(*) as total FROM medications m WHERE m.user_id = $1 AND m.active = TRUE${memberFilter.replace('m.','m.')}`,
      params
    );

    // Doses de hoje
    const todayLogsResult = await pool.query(
      `SELECT COUNT(*) FILTER (WHERE status = 'taken') as taken,
              COUNT(*) FILTER (WHERE status = 'missed') as missed,
              COUNT(*) as total
       FROM dose_logs dl
       JOIN medications m ON dl.medication_id = m.id
       WHERE m.user_id = $1 AND dl.scheduled_at::date = CURRENT_DATE${memberFilter}`,
      params
    );

    // Medicamentos com estoque crítico (< 20% do total)
    const criticalResult = await pool.query(
      `SELECT COUNT(*) as total FROM medications m
       WHERE m.user_id = $1 AND m.active = TRUE AND m.stock_quantity < (m.stock_total * 0.2)${memberFilter.replace('m.','m.')}`,
      params
    );

    // Próximas doses
    const nextDosesResult = await pool.query(
      `SELECT ds.scheduled_time, m.name, m.dosage, m.icon
       FROM dose_schedules ds
       JOIN medications m ON ds.medication_id = m.id
       WHERE m.user_id = $1 AND m.active = TRUE AND ds.scheduled_time > CURRENT_TIME${memberFilter}
       ORDER BY ds.scheduled_time ASC LIMIT 3`,
      params
    );

    // Prescrições ativas
    const prescriptionsResult = await pool.query(
      `SELECT m.*, ds.scheduled_time
       FROM medications m
       LEFT JOIN dose_schedules ds ON ds.medication_id = m.id
       WHERE m.user_id = $1 AND m.active = TRUE${memberFilter.replace('m.','m.')}
       ORDER BY m.stock_quantity ASC LIMIT 6`,
      params
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
    console.error('Erro no dashboard:', err);
    res.status(500).json({ error: 'Erro ao gerar resumo' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH METRICS ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/health-metrics
app.get('/api/health-metrics', authMiddleware, async (req, res) => {
  const { date, family_member_id } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM health_metrics 
       WHERE user_id = $1 AND family_member_id = $2 AND date = $3`,
      [req.userId, family_member_id || null, date || new Date().toISOString().split('T')[0]]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar métricas:', err);
    res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
});

// POST /api/health-metrics (Upsert)
app.post('/api/health-metrics', authMiddleware, async (req, res) => {
  const { family_member_id, metric_type, value, date, unit } = req.body;
  if (!metric_type || value === undefined) {
    return res.status(400).json({ error: 'metric_type e value são obrigatórios' });
  }

  const metricDate = date || new Date().toISOString().split('T')[0];

  try {
    const result = await pool.query(
      `INSERT INTO health_metrics (user_id, family_member_id, metric_type, value, unit, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, family_member_id, metric_type, date)
       DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [req.userId, family_member_id || null, metric_type, value, unit || '', metricDate]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar métrica:', err);
    res.status(500).json({ error: 'Erro ao salvar métrica' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Banco de dados: Neon PostgreSQL`);
});
