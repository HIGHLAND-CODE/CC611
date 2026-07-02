// API cliente genérica para el proyecto COBRANZAS-611.
// Si la aplicación está desplegada como sitio estático (GitHub Pages),
// define `window.__API_BASE__` en `frontend/index.html` con la URL pública
// del backend (p. ej. 'https://mi-backend.example.com').
const API_BASE = (typeof window !== 'undefined' && window.__API_BASE__) ? window.__API_BASE__ : '/api';

function saveSessionData(data) {
  localStorage.setItem('cobranzas611_session', JSON.stringify(data));
}

function getSessionData() {
  const stored = localStorage.getItem('cobranzas611_session');
  return stored ? JSON.parse(stored) : null;
}

function clearSessionData() {
  localStorage.removeItem('cobranzas611_session');
}

function getAuthHeaders() {
  const session = getSessionData();
  if (!session || !session.token) {
    return {};
  }
  return { Authorization: `Bearer ${session.token}` };
}

async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  const authHeaders = getAuthHeaders();
  const mergedHeaders = { ...headers, ...authHeaders };
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: mergedHeaders,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(errorData.message || 'Error en la solicitud');
  }
  return response.json();
}

function requireSession() {
  const session = getSessionData();
  if (!session) {
    window.location.href = 'index.html';
    throw new Error('Sesión no encontrada.');
  }
  return session;
}

function logout() {
  clearSessionData();
  window.location.href = 'index.html';
}
