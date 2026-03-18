import express from 'express';
const router = express.Router();
import { getEmailSettings, updateEmailSettings } from '../controllers/emailSettingsController.js';

router.get('/', getEmailSettings);
router.put('/', updateEmailSettings);

export default router;
