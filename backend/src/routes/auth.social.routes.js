const express = require('express');
const router = express.Router();
const authSocialController = require('../controllers/auth.social.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Generate Auth URL (requires login)
router.get('/:provider/url', authenticate, authSocialController.generateAuthUrl);

// OAuth Callback from providers (public route, the provider server redirects the user here)
router.get('/:provider/callback', authSocialController.handleCallback);

module.exports = router;
