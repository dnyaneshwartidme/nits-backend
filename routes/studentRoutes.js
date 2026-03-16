import express from 'express';
import { studentLogin, getStudentProfile } from '../controllers/studentController.js';
import { verifyStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', studentLogin);

// Protected student routes
router.get('/profile', verifyStudent, getStudentProfile);

export default router;
