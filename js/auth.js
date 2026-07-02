// Maneja el login en la página principal del sistema.
const loginForm = document.getElementById('loginForm');
const messageElement = document.getElementById('message');

async function handleLogin(event) {
  event.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const clave = document.getElementById('clave').value.trim();

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error de autenticación.');
    }

    const data = await response.json();
    localStorage.setItem('cobranzas611_session', JSON.stringify(data));

    if (data.role === 'ADMIN') {
      window.location.href = '/frontend/admin.html';
    } else {
      window.location.href = '/frontend/vendedor.html';
    }
  } catch (error) {
    messageElement.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}
