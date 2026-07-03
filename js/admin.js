// Lógica de administración para subir archivos y procesar Excel.
import { getSessionData, logout, apiFetch } from './api.js';

const adminFormDeudas = document.getElementById('formDeudas');
const adminFormVisitas = document.getElementById('formVisitas');
const deudasMessage = document.getElementById('deudasMessage');
const visitasMessage = document.getElementById('visitasMessage');
const logoutBtnAdmin = document.getElementById('logoutBtn');

function requireAdminSession() {
  const session = getSessionData();
  if (!session) {
    window.location.href = 'index.html';
  }
}

async function handleUpload(form, messageElement, path) {
  messageElement.innerHTML = '';
  const formData = new FormData(form);
  try {
    const data = await apiFetch(path, {
      method: 'POST',
      body: formData,
    });
    messageElement.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
  } catch (error) {
    messageElement.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

requireAdminSession();

adminFormDeudas?.addEventListener('submit', (event) => {
  event.preventDefault();
  handleUpload(adminFormDeudas, deudasMessage, '/admin/upload/deudas');
});

adminFormVisitas?.addEventListener('submit', (event) => {
  event.preventDefault();
  handleUpload(adminFormVisitas, visitasMessage, '/admin/upload/visitas');
});

if (logoutBtnAdmin) {
  logoutBtnAdmin.addEventListener('click', logout);
}
