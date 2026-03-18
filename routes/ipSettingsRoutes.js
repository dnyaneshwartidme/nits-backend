import express from 'express';
import { getAllowedIp, updateAllowedIp, getMyIp } from '../controllers/ipSettingsController.js';

const router = express.Router();

// Get configured IP (used by admin panel and attendance page)
router.get('/', getAllowedIp);

// Update configured IP (used by admin panel)
router.put('/', updateAllowedIp);

// Get the requesting client's IP (used by attendance page)
router.get('/my-ip', getMyIp);

export default router;
