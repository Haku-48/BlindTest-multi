import express from 'express';
const router = express.Router();

import feedbackController from '../controller/feedback.controller.ts';

router.post('/', feedbackController.feedback);

export default router;