// Serviço centralizado de chamadas à API
const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('auth_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('auth_token');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

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
  create: (formData) => request('/family-members', { method: 'POST', body: formData }),
  remove: (id) => request(`/family-members/${id}`, { method: 'DELETE' }),
};

// ─── Dose Schedules ───────────────────────────────────────────────────────────
export const schedulesApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/dose-schedules${qs ? `?${qs}` : ''}`);
  },
};

// ─── Dose Logs ────────────────────────────────────────────────────────────────
export const doseLogsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/dose-logs${qs ? `?${qs}` : ''}`);
  },
  create: (body) => request('/dose-logs', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  get: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/dashboard${qs ? `?${qs}` : ''}`);
  },
};

// ─── Health Metrics ───────────────────────────────────────────────────────────
export const healthMetricsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/health-metrics${qs ? `?${qs}` : ''}`);
  },
  update: (body) => request('/health-metrics', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── AI Insights ──────────────────────────────────────────────────────────────
export const aiApi = {
  getMedicationSummary: (body) => request('/ai/medication-summary', { method: 'POST', body: JSON.stringify(body) }),
};
