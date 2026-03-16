import express from 'express';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import {
    getAllAttendance,
    downloadAttendanceExcel,
    // Backup API functions — manage yearly Excel attendance files
    getBackupYears,
    getBackupFiles,
    downloadBackupFile
} from '../controllers/attendanceController.js';

const router = express.Router();

// All routes below require a valid admin JWT token
router.use(verifyAdmin);


// ---------------------------------------------------
// Existing Attendance Routes
// ---------------------------------------------------

// GET: /api/admin/attendance
// Returns all attendance records with optional filters (search, type, course_id)
router.get('/', getAllAttendance);

// GET: /api/admin/attendance/download
// Generates and downloads a filtered attendance Excel report
router.get('/download', downloadAttendanceExcel);


// ---------------------------------------------------
// Backup Routes — Yearly Excel File Download
// ---------------------------------------------------

// GET: /api/admin/attendance/backup/years
// Returns: { years: ['2026', '2025', ...] }
// Lists all year folders found in attendance/yearly_exl_file/
router.get('/backup/years', getBackupYears);

// GET: /api/admin/attendance/backup/files/:year
// Returns: { files: [{ name, sizeKB, lastModified }, ...] }
// Lists all .xlsx files inside the specified year folder
router.get('/backup/files/:year', getBackupFiles);

// GET: /api/admin/attendance/backup/download/:year/:filename
// Streams the specified Excel file to the browser as a direct download
// Example: /backup/download/2026/March_2026.xlsx
router.get('/backup/download/:year/:filename', downloadBackupFile);


export default router;
