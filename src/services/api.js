// Serviço centralizado de chamadas à API
const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('emc_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Erro ${res.status}`);
  }
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
};

// ─── Medications ──────────────────────────────────────────────────────────────
export const medicationsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/medications${qs ? `?${qs}` : ''}`);
  },
  create: (body) => request('/medications', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/medications/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/medications/${id}`, { method: 'DELETE' }),
};

// ─── Family Members ───────────────────────────────────────────────────────────
export const familyApi = {
  list: () => request('/family-members'),
  create: (body) => request('/family-members', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id) => request(`/family-members/${id}`, { method: 'DELETE' }),
};

// ─── Dose Schedules ───────────────────────────────────────────────────────────
export const schedulesApi = {
  list: () => request('/dose-schedules'),
};

// ─── Dose Logs ────────────────────────────────────────────────────────────────
export const doseLogsApi = {
  list: (days = 7) => request(`/dose-logs?days=${days}`),
  create: (body) => request('/dose-logs', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  get: () => request('/dashboard'),
};
