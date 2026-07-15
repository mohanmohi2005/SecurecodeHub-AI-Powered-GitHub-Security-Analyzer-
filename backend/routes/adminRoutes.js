import express from 'express';
import { getRecentActivity } from '../controllers/adminController.js';

const router = express.Router();

router.get('/recent-activity', getRecentActivity);

export default router;
