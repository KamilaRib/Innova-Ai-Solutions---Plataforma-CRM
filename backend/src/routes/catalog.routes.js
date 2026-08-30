const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const canEdit = authorize('ADMINISTRADOR', 'MARKETING');

// Criativos
router.get('/creatives', authenticate, catalogController.getCreatives);
router.post('/creatives', authenticate, canEdit, catalogController.createCreative);
router.patch('/creatives/:id', authenticate, canEdit, catalogController.updateCreative);
router.delete('/creatives/:id', authenticate, canEdit, catalogController.deleteCreative);

// Produtos (Público e Privado)
router.get('/public-products', catalogController.getProducts); // Rota pública para o catálogo
router.get('/products', authenticate, catalogController.getProducts);
router.post('/products', authenticate, canEdit, catalogController.createProduct);
router.patch('/products/:id', authenticate, canEdit, catalogController.updateProduct);
router.delete('/products/:id', authenticate, canEdit, catalogController.deleteProduct);
router.post('/products/:id/nfse', authenticate, canEdit, catalogController.emitDemoNFSe);

module.exports = router;
