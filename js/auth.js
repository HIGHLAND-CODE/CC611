// Maneja el login en la página principal del sistema.
import { apiFetch, saveSessionData } from './api.js';

const loginForm = document.getElementById('loginForm');
const messageElement = document.getElementById('message');

function normalizeUsuario(input) {
  const trimmed = input.trim();
  if (!trimmed) return '';
  const upper = trimmed.toUpperCase();
  if (upper === 'ADMIN') return 'admin';
  if (upper.startsWith('V')) return upper;
  if (/^\d+$/.test(upper)) return `V${upper}`;
  return upper;
}

async function handleLogin(event) {
  event.preventDefault();
  const rawUsuario = document.getElementById('usuario').value;
  const usuario = normalizeUsuario(rawUsuario);
  const clave = document.getElementById('clave').value.trim();

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave }),
    });

    saveSessionData(data);

    if (data.role === 'ADMIN') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'vendedor.html';
    }
  } catch (error) {
    messageElement.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}
