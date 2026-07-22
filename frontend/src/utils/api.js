const API_URL = import.meta.env.VITE_API_URL || '';

// Wrapper de fetch que anexa o token JWT salvo no login e trata sessão expirada/sem permissão.
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...(options.headers || {}) };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return response;
  }

  return response;
}
