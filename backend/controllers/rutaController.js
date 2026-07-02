const { getVisitasData, getDeudasData } = require('../services/dataService');

const DAY_MAP = {
  lunes: 'lunes',
  martes: 'martes',
  miercoles: 'miercoles',
  miércoles: 'miercoles',
  jueves: 'jueves',
  viernes: 'viernes',
  sabado: 'sabado',
  sábado: 'sabado',
  domingo: 'domingo',
};

exports.getRutaDiaria = async (req, res) => {
  try {
    const visitas = await getVisitasData();
    const deudas = await getDeudasData();
    const vendedorParam = req.params.vendedor.toUpperCase();
    const vendedorId = vendedorParam.replace(/[^0-9]/g, '');

    const today = new Date();
    const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
    const dayKey = DAY_MAP[dayName] || 'lunes';

    const clientesHoy = visitas.filter((item) => String(item[dayKey]).trim() === vendedorId);
    const ruta = clientesHoy
      .map((cliente) => {
        const deuda = deudas.find((item) => String(item.clienteId) === String(cliente.codigo));
        const saldo = deuda ? Number(deuda.saldo) : 0;
        return {
          clienteId: String(cliente.codigo),
          razonSocial: cliente.razon_social || '',
          saldo,
        };
      })
      .filter((item) => item.saldo > 0);

    return res.json(ruta);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener ruta diaria.', error: error.message });
  }
};
