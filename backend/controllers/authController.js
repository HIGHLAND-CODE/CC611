const { VENDEDORES, ADMIN_CREDENTIALS, createToken, getVendedorNombre, validateVendedorPassword } = require('../config/authConfig');

exports.login = (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({ message: 'Usuario y clave son requeridos.' });
  }

  if (usuario === ADMIN_CREDENTIALS.usuario && clave === ADMIN_CREDENTIALS.clave) {
    const token = createToken('ADMIN', usuario);
    return res.json({ role: 'ADMIN', usuario, token });
  }

  if (validateVendedorPassword(usuario, clave)) {
    const token = createToken('VENDEDOR', usuario);
    return res.json({ role: 'VENDEDOR', usuario, nombre: getVendedorNombre(usuario), token });
  }

  return res.status(401).json({ message: 'Credenciales inválidas.' });
};
