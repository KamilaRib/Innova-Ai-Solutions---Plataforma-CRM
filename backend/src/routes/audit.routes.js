const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');

router.get('/', auditController.listAudit);

module.exports = router;
