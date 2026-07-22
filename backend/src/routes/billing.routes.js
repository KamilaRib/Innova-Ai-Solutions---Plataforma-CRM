const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const canBill = authorize('ADMINISTRADOR', 'COMERCIAL');

router.get('/invoices', authenticate, canBill, billingController.listInvoices);
router.post('/invoices', authenticate, canBill, billingController.createInvoice);

module.exports = router;
