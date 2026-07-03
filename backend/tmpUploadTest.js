const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const filePath = path.join(__dirname, 'tmp_deudas.xlsx');
const wb = XLSX.utils.book_new();
const data = [
  ['id cliente', 'razon_social', 'importe_movimiento', 'cod_ven'],
  ['111', 'Cliente Test', '1000', '31'],
];
const ws = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
XLSX.writeFile(wb, filePath);

(async () => {
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: 'admin', clave: '611admin' }),
  });
  const loginData = await loginRes.json();
  console.log('login', loginRes.status, loginData);

  const form = new FormData();
  form.append('deudasFile', fs.createReadStream(filePath));

  const uploadRes = await fetch('http://localhost:4000/api/admin/upload/deudas', {
    method: 'POST',
    headers: { Authorization: `Bearer ${loginData.token}` },
    body: form,
  });
  console.log('upload', uploadRes.status, await uploadRes.text());
})();
