const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/', usersController.listUsers);
router.post('/', usersController.createUser);
router.patch('/:id', usersController.updateUser);
router.delete('/me', usersController.deleteMyAccount);
router.delete('/:id', usersController.deactivateUser);

module.exports = router;
