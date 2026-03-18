import express from 'express';
import { getLocationSettings, updateLocationSettings } from '../controllers/locationSettingsController.js';

const router = express.Router();

// Get configured location (used by admin panel and attendance page)
router.get('/', getLocationSettings);

// Update configured location (used by admin panel)
router.put('/', updateLocationSettings);

export default router;
