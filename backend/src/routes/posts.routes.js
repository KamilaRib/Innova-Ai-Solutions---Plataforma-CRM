const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, postsController.createPost);
router.get('/', authenticate, postsController.getPosts);

module.exports = router;
