import express from 'express';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { 
    getPendingStudents, 
    approveStudent, 
    rejectStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    getAllCourses
} from '../controllers/adminController.js';
import { changePassword } from '../controllers/authController.js';

const router = express.Router();

// Apply auth middleware to all routes below
router.use(verifyAdmin);

router.post('/change-password', changePassword);

// GET: /api/admin/pending-verifications
router.get('/pending-verifications', getPendingStudents);

// POST: /api/admin/approve-student
router.post('/approve-student', approveStudent);

// DELETE: /api/admin/reject-student/:id
router.delete('/reject-student/:id', rejectStudent);

// 1. GET: /api/admin/students (with Filters)
router.get('/students', getAllStudents);

// 2. GET: /api/admin/students/:id
router.get('/students/:id', getStudentById);

// 3. PUT: /api/admin/students/:id
router.put('/students/:id', updateStudent);

// 4. GET: /api/admin/courses
router.get('/courses', getAllCourses);

export default router;
