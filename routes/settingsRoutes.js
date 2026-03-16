import express from 'express';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { 
    getSettingsItems, 
    addSettingsItem, 
    updateSettingsItem, 
    deleteSettingsItem,
    reorderSettingsItems
} from '../controllers/settingsController.js';

const router = express.Router();

router.use(verifyAdmin);

router.get('/:type', getSettingsItems);
router.post('/:type', addSettingsItem);
router.put('/:type/:id', updateSettingsItem);
router.delete('/:type/:id', deleteSettingsItem);
router.post('/:type/reorder', reorderSettingsItems);

export default router;
