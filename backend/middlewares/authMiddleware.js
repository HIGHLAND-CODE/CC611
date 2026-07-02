const { VENDEDORES, ADMIN_CREDENTIALS, createToken } = require('../config/authConfig');

exports.verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (token !== ADMIN_CREDENTIALS.token) {
    return res.status(401).json({ message: 'Acceso de administrador no autorizado.' });
  }

  next();
};

exports.verifyVendedor = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  const vendedorKey = Object.keys(VENDEDORES).find((key) => createToken('VENDEDOR', key) === token);

  if (!vendedorKey) {
    return res.status(401).json({ message: 'Acceso de vendedor no autorizado.' });
  }

  req.vendedor = { id: vendedorKey, nombre: `Vendedor ${vendedorKey.replace(/[^0-9]/g, '')}` };
  next();
};
