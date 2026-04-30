const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');

// Criativos
router.get('/creatives', catalogController.getCreatives);
router.post('/creatives', catalogController.createCreative);
router.patch('/creatives/:id', catalogController.updateCreative);
router.delete('/creatives/:id', catalogController.deleteCreative);

// Produtos
router.get('/products', catalogController.getProducts);
router.post('/products', catalogController.createProduct);
router.patch('/products/:id', catalogController.updateProduct);
router.delete('/products/:id', catalogController.deleteProduct);

module.exports = router;
