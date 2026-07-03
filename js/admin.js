// Lógica de administración para subir archivos y procesar Excel.
const adminFormDeudas = document.getElementById('formDeudas');
const adminFormVisitas = document.getElementById('formVisitas');
const deudasMessage = document.getElementById('deudasMessage');
const visitasMessage = document.getElementById('visitasMessage');
const logoutBtnAdmin = document.getElementById('logoutBtn');

function validateLogin() {
  const session = localStorage.getItem('cobranzas611_session');
  if (!session) {
    window.location.href = 'index.html';
  }
}

async function handleUpload(form, messageElement, path) {
  const formData = new FormData(form);
  try {
    const session = JSON.parse(localStorage.getItem('cobranzas611_session'));
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: formData,
    });

    const responseText = await response.text();
    const responseJson = (() => {
      try {
        return JSON.parse(responseText);
      } catch {
        return null;
      }
    })();

    if (!response.ok) {
      const errorMessage = responseJson?.message || responseText || `Error al subir el archivo (HTTP ${response.status}).`;
      throw new Error(`${errorMessage} ${responseJson ? '' : `(HTTP ${response.status})`}`.trim());
    }

    const data = responseJson || { message: 'Archivo procesado correctamente.' };
    messageElement.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
  } catch (error) {
    messageElement.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

if (adminFormDeudas) {
  validateLogin();
  adminFormDeudas.addEventListener('submit', (event) => {
    event.preventDefault();
    handleUpload(adminFormDeudas, deudasMessage, '/api/admin/upload/deudas');
  });
}

if (adminFormVisitas) {
  validateLogin();
  adminFormVisitas.addEventListener('submit', (event) => {
    event.preventDefault();
    handleUpload(adminFormVisitas, visitasMessage, '/api/admin/upload/visitas');
  });
}

if (logoutBtnAdmin) {
  logoutBtnAdmin.addEventListener('click', () => {
    localStorage.removeItem('cobranzas611_session');
    window.location.href = 'index.html';
  });
}
