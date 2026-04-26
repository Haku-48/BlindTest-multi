import express from 'express';
const router = express.Router();

const feedbackController = require('../controller/feedback.controller');

router.post('/', feedbackController.feedback);

module.exports = router;