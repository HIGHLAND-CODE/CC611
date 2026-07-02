const XLSX = require('xlsx');
const { saveDeudasData, saveVisitasData } = require('../services/dataService');

function parseWorkbook(fileBuffer) {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer', raw: false });
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false, defval: '' });
}

exports.uploadDeudas = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Archivo de deudas no fue recibido.' });
  }

  try {
    const rows = parseWorkbook(req.file.buffer);
    const deudas = {};

    rows.forEach((row) => {
      const clienteId = String(row['id cliente'] || row['id_cliente'] || row['clienteId'] || '').trim();
      const razonSocial = String(row['razon_social'] || row['razon social'] || row['razonSocial'] || '').trim();
      const importeMovimiento = parseFloat(String(row['ImporteMovimiento'] || row['importeMovimiento'] || row['importe_movimiento'] || 0).replace(/[^0-9.-]+/g, '')) || 0;
      const codVen = String(row['cod_ven'] || row['cod ven'] || row['codVendedor'] || '').trim();

      if (!clienteId) return;
      const vendedor = codVen.replace(/[^0-9]/g, '') || '';

      if (!deudas[clienteId]) {
        deudas[clienteId] = { clienteId, razonSocial, saldo: 0, vendedor };
      }

      deudas[clienteId].saldo += importeMovimiento;
    });

    const deudasArray = Object.values(deudas).map((item) => ({
      clienteId: item.clienteId,
      razonSocial: item.razonSocial,
      saldo: Number(item.saldo.toFixed(2)),
      vendedor: item.vendedor,
    }));

    await saveDeudasData(deudasArray);
    return res.json({ message: 'Deudas procesadas y guardadas.', registros: deudasArray.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error al procesar el archivo de deudas.', error: error.message });
  }
};

exports.uploadVisitas = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Archivo de visitas no fue recibido.' });
  }

  try {
    const rows = parseWorkbook(req.file.buffer);
    const visitas = rows.map((row) => ({
      codigo: String(row['codigo'] || row['Codigo'] || row['codigo cliente'] || '').trim(),
      razon_social: String(row['razon_social'] || row['razon social'] || row['Razon Social'] || '').trim(),
      vendedor: String(row['vendedor'] || row['Vendedor'] || '').trim(),
      lunes: String(row['lunes'] || '').trim(),
      martes: String(row['martes'] || '').trim(),
      miercoles: String(row['miercoles'] || row['miércoles'] || '').trim(),
      jueves: String(row['jueves'] || '').trim(),
      viernes: String(row['viernes'] || '').trim(),
      sabado: String(row['sabado'] || row['sábado'] || '').trim(),
      domingo: String(row['domingo'] || '').trim(),
    }));

    await saveVisitasData(visitas);
    return res.json({ message: 'Visitas procesadas y guardadas.', registros: visitas.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error al procesar el archivo de visitas.', error: error.message });
  }
};
