const crypto = require('crypto');

const VENDEDORES = {
  V31: 'Vendedor 31',
  V32: 'Vendedor 32',
  V33: 'Vendedor 33',
  V34: 'Vendedor 34',
  V35: 'Vendedor 35',
  V36: 'Vendedor 36',
  V37: 'Vendedor 37',
  V38: 'Vendedor 38',
  V39: 'Vendedor 39',
  V40: 'Vendedor 40',
  V41: 'Vendedor 41',
  V42: 'Vendedor 42',
  V43: 'Vendedor 43',
  V44: 'Vendedor 44',
  V45: 'Vendedor 45',
  V46: 'Vendedor 46',
  V47: 'Vendedor 47',
  V48: 'Vendedor 48',
  V49: 'Vendedor 49',
  V50: 'Vendedor 50',
  V51: 'Vendedor 51',
  V52: 'Vendedor 52',
  V53: 'Vendedor 53',
  V54: 'Vendedor 54',
  V55: 'Vendedor 55',
  V56: 'Vendedor 56',
  V57: 'Vendedor 57',
  V58: 'Vendedor 58',
  V59: 'Vendedor 59',
  V60: 'Vendedor 60',
  V61: 'Vendedor 61',
  V62: 'Vendedor 62',
  V63: 'Vendedor 63',
  V64: 'Vendedor 64',
  V65: 'Vendedor 65'
};

const ADMIN_CREDENTIALS = {
  usuario: 'admin',
  clave: '611admin',
};

function createToken(role, usuario) {
  return crypto.createHash('sha256').update(`${role}:${usuario}:611`).digest('hex');
}

ADMIN_CREDENTIALS.token = createToken('ADMIN', ADMIN_CREDENTIALS.usuario);

function getVendedorNombre(vendedorId) {
  return VENDEDORES[vendedorId] || `Vendedor ${vendedorId.replace(/[^0-9]/g, '')}`;
}

function validateVendedorPassword(usuario, clave) {
  return usuario in VENDEDORES && clave === `${usuario}pass`;
}

module.exports = {
  VENDEDORES,
  ADMIN_CREDENTIALS,
  createToken,
  getVendedorNombre,
  validateVendedorPassword,
};
