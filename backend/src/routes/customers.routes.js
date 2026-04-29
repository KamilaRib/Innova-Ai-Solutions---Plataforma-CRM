const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers.controller');

router.post('/', customersController.upsertCustomer);
router.get('/:phone', customersController.getCustomerByPhone);

module.exports = router;
