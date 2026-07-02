const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const rutaController = require('../controllers/rutaController');
const cobranzaController = require('../controllers/cobranzaController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMemoryMiddleware = require('../middlewares/uploadMiddleware');
const uploadDiskMiddleware = require('../middlewares/storageMiddleware');

router.post('/auth/login', authController.login);
router.post('/admin/upload/deudas', authMiddleware.verifyAdmin, uploadMemoryMiddleware.single('deudasFile'), adminController.uploadDeudas);
router.post('/admin/upload/visitas', authMiddleware.verifyAdmin, uploadMemoryMiddleware.single('visitasFile'), adminController.uploadVisitas);
router.get('/ruta/:vendedor', authMiddleware.verifyVendedor, rutaController.getRutaDiaria);
router.post('/cobranzas', authMiddleware.verifyVendedor, uploadDiskMiddleware.fields([{ name: 'comprobante', maxCount: 1 }, { name: 'retencion', maxCount: 1 }]), cobranzaController.createCobranza);
router.get('/cobranzas', authMiddleware.verifyVendedor, cobranzaController.getCobranzas);

module.exports = router;
