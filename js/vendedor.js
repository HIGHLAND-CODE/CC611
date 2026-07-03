// Lógica del panel de vendedor para mostrar ruta y registrar cobranzas.
import { getSessionData, logout, apiFetch } from './api.js';

const rutaContainer = document.getElementById('rutaContainer');
const welcomeText = document.getElementById('welcomeText');
const logoutBtnVendedor = document.getElementById('logoutBtn');
const cobranzaForm = document.getElementById('cobranzaForm');
const cobranzaMessage = document.getElementById('cobranzaMessage');

function mostrarClientes(clientes) {
  if (!rutaContainer) return;
  rutaContainer.innerHTML = '';

  if (clientes.length === 0) {
    rutaContainer.innerHTML = '<div class="col-12"><div class="alert alert-warning">No hay clientes para visitar hoy.</div></div>';
    return;
  }

  clientes.forEach((cliente) => {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
      <div class="card client-card h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">${cliente.razonSocial}</h5>
            <p class="card-text mb-1"><strong>Código:</strong> ${cliente.clienteId}</p>
            <p class="card-text"><strong>Saldo:</strong> $${cliente.saldo.toFixed(2)}</p>
          </div>
          <button class="btn btn-primary mt-3 select-client-btn" data-cliente='${JSON.stringify(cliente)}'>Registrar Cobro</button>
        </div>
      </div>
    `;
    rutaContainer.appendChild(col);
  });

  document.querySelectorAll('.select-client-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const cliente = JSON.parse(event.target.getAttribute('data-cliente'));
      llenarFormulario(cliente);
    });
  });
}

function llenarFormulario(cliente) {
  document.getElementById('clienteNombre').value = cliente.razonSocial;
  document.getElementById('clienteCodigo').value = cliente.clienteId;
  document.getElementById('saldoAnterior').value = cliente.saldo.toFixed(2);
}

async function cargarRuta() {
  const session = getSessionData();
  if (!session) return;

  welcomeText.textContent = `Bienvenido ${session.nombre || session.usuario}`;
  try {
    const data = await apiFetch(`/ruta/${session.usuario}`);
    mostrarClientes(data);
  } catch (error) {
    rutaContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger">${error.message}</div></div>`;
  }
}

async function enviarCobranza(event) {
  event.preventDefault();
  const session = getSessionData();
  if (!session) return;

  const formData = new FormData(cobranzaForm);
  formData.append('vendedorId', session.usuario);
  formData.append('vendedorNombre', session.nombre || session.usuario);

  try {
    const data = await apiFetch('/cobranzas', {
      method: 'POST',
      body: formData,
    });

    cobranzaMessage.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
    cobranzaForm.reset();
    cargarRuta(); // Opcional: Recargar la ruta para ver el saldo actualizado
  } catch (error) {
    cobranzaMessage.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

if (logoutBtnVendedor) {
  logoutBtnVendedor.addEventListener('click', logout);
}

if (cobranzaForm) {
  cobranzaForm.addEventListener('submit', enviarCobranza);
}

cargarRuta();
