const fs = require('fs');
const path = require('path');

const dataFolder = path.join(__dirname, '..', 'data');
const deudasPath = path.join(dataFolder, 'deudas.json');
const visitasPath = path.join(dataFolder, 'visitas.json');
const cobranzasPath = path.join(dataFolder, 'cobranzas.json');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileData = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

exports.ensureDataFiles = () => {
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }

  if (!fs.existsSync(deudasPath)) {
    writeJson(deudasPath, []);
  }
  if (!fs.existsSync(visitasPath)) {
    writeJson(visitasPath, []);
  }
  if (!fs.existsSync(cobranzasPath)) {
    writeJson(cobranzasPath, []);
  }
};

exports.getDeudasData = () => readJson(deudasPath);
exports.saveDeudasData = (data) => writeJson(deudasPath, data);
exports.getVisitasData = () => readJson(visitasPath);
exports.saveVisitasData = (data) => writeJson(visitasPath, data);
exports.getCobranzasData = () => readJson(cobranzasPath);
exports.saveCobranzaData = (data) => writeJson(cobranzasPath, data);
