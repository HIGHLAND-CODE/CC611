const { getCobranzasData, saveCobranzaData, getDeudasData } = require('../services/dataService');

exports.createCobranza = async (req, res) => {
  try {
    const {
      vendedorId,
      vendedorNombre,
      clienteId,
      razonSocial,
      saldoAnterior,
      montoCobrado,
      fechaTransferencia,
      observaciones,
      prioridad,
    } = req.body;

    if (!vendedorId || !clienteId || !montoCobrado || !fechaTransferencia || !prioridad) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben completarse.' });
    }

    const comprobante = req.files?.comprobante?.[0]?.filename || '';
    const retencion = req.files?.retencion?.[0]?.filename || '';

    const nuevaCobranza = {
      fechaCarga: new Date().toISOString(),
      vendedorId,
      vendedorNombre,
      clienteId,
      razonSocial,
      saldoAnterior: Number(saldoAnterior) || 0,
      montoCobrado: Number(montoCobrado) || 0,
      fechaTransferencia,
      observaciones: observaciones || '',
      prioridad,
      comprobante,
      retencion,
    };

    const cobranzas = await getCobranzasData();
    cobranzas.push(nuevaCobranza);
    await saveCobranzaData(cobranzas);

    return res.json({ message: 'Cobranza registrada con éxito.', cobranza: nuevaCobranza });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar la cobranza.', error: error.message });
  }
};

exports.getCobranzas = async (req, res) => {
  try {
    const cobranzas = await getCobranzasData();
    return res.json(cobranzas);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener cobranzas.', error: error.message });
  }
};
