// Maneja el login en la página principal del sistema.
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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave }),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMessage = data?.message || responseText || 'Error de autenticación.';
      throw new Error(errorMessage);
    }

    localStorage.setItem('cobranzas611_session', JSON.stringify(data));

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
