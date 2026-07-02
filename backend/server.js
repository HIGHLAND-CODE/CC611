const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const { ensureDataFiles } = require('./services/dataService');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));

ensureDataFiles();

app.use('/api', apiRoutes);

app.get('/frontend/*', (req, res) => {
  const filePath = req.path.replace('/frontend/', '');
  return res.sendFile(path.join(__dirname, '..', 'frontend', filePath));
});

app.get('/', (req, res) => {
  res.redirect('/frontend/index.html');
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno en el servidor.';

  if (req.path.startsWith('/api')) {
    return res.status(status).json({ message });
  }

  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
