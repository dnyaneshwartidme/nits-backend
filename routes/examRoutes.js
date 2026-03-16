import express from 'express';
import { verifyAdmin, verifyStudent } from '../middleware/authMiddleware.js';
import { 
    addSubject, 
    getSubjects, 
    toggleSubjectStatus, 
    updateSubjectLimits,
    addQuestion, 
    getQuestions, 
    updateQuestion,
    deleteQuestion,
    getAdminSubjectStats,
    getAdminSubjectResults,
    deleteExamResult,
    getStudentExamResults,
    getStudentSubjects, 
    getStudentQuestions, 
    submitExam, 
    getMyResults 
} from '../controllers/examController.js';

const router = express.Router();

// ==========================================
// ADMIN EXAM APIs
// ==========================================

// Add a new subject
router.post('/subjects', verifyAdmin, addSubject);

// Get all subjects (Admin view)
router.get('/subjects', verifyAdmin, getSubjects);

// Toggle subject status (ON/OFF)
router.put('/subjects/:id/toggle', verifyAdmin, toggleSubjectStatus);

// Update subject question limits & timer
router.put('/subjects/:id/limits', verifyAdmin, updateSubjectLimits);

// Add a new question
router.post('/questions', verifyAdmin, addQuestion);

// Get all questions
router.get('/questions', verifyAdmin, getQuestions);

// Delete a question
router.delete('/questions/:id', verifyAdmin, deleteQuestion);

// Update a question
router.put('/questions/:id', verifyAdmin, updateQuestion);

// ==========================================
// ADMIN RESULTS APIs
// ==========================================

// Get all subjects with attempt counts
router.get('/admin-subject-stats', verifyAdmin, getAdminSubjectStats);

// Get all results for a specific subject
router.get('/admin-subject-results/:subjectId', verifyAdmin, getAdminSubjectResults);

// Delete a specific exam result
router.delete('/admin-results/:resultId', verifyAdmin, deleteExamResult);

// Get exam results for a specific student (by sid) - for student info page
router.get('/student-exam-results/:sid', verifyAdmin, getStudentExamResults);

// ==========================================
// STUDENT EXAM APIs
// ==========================================

// Get active subjects
router.get('/student-subjects', verifyStudent, getStudentSubjects);

// Get questions for a specific subject
router.get('/student-questions/:subjectId', verifyStudent, getStudentQuestions);

// Submit exam
router.post('/submit', verifyStudent, submitExam);

// Get my results
router.get('/my-results', verifyStudent, getMyResults);

export default router;
