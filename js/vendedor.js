// Lógica del panel de vendedor para mostrar ruta y registrar cobranzas.
const rutaContainer = document.getElementById('rutaContainer');
const welcomeText = document.getElementById('welcomeText');
const logoutBtnVendedor = document.getElementById('logoutBtn');
const cobranzaForm = document.getElementById('cobranzaForm');
const cobranzaMessage = document.getElementById('cobranzaMessage');

function obtenerSesion() {
  const session = localStorage.getItem('cobranzas611_session');
  if (!session) {
    window.location.href = '/frontend/index.html';
    return null;
  }
  return JSON.parse(session);
}

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
  const session = obtenerSesion();
  if (!session) return;

  welcomeText.textContent = `Bienvenido ${session.nombre || session.usuario}`;
  try {
    const response = await fetch(`/api/ruta/${session.usuario}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    if (!response.ok) {
      throw new Error('No se pudo obtener la ruta.');
    }
    const data = await response.json();
    mostrarClientes(data);
  } catch (error) {
    rutaContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger">${error.message}</div></div>`;
  }
}

async function enviarCobranza(event) {
  event.preventDefault();
  const session = obtenerSesion();
  if (!session) return;

  const formData = new FormData(cobranzaForm);
  formData.append('vendedorId', session.usuario);
  formData.append('vendedorNombre', session.nombre || session.usuario);

  try {
    const response = await fetch('/api/cobranzas', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}` },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar la cobranza.');
    }

    const data = await response.json();
    cobranzaMessage.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
    cobranzaForm.reset();
  } catch (error) {
    cobranzaMessage.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

if (logoutBtnVendedor) {
  logoutBtnVendedor.addEventListener('click', () => {
    localStorage.removeItem('cobranzas611_session');
    window.location.href = '/frontend/index.html';
  });
}

if (cobranzaForm) {
  cobranzaForm.addEventListener('submit', enviarCobranza);
}

cargarRuta();
