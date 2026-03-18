import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ExcelJS from 'exceljs';
import jwt from 'jsonwebtoken';          // Used for QR session tokens
import Db from './config/db.js';
import createTables from './models/studentModel.js';
import adminRoutes from './routes/adminRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import examRoutes from './routes/examRoutes.js';
import locationSettingsRoutes from './routes/locationSettingsRoutes.js'; // <-- NEW LOCATION SETTINGS ROUTES
import createLocationSettingsTable from './models/locationSettingsModel.js'; // <-- NEW MODEL INITIALIZER
import emailSettingsRoutes from './routes/emailSettingsRoutes.js';
import createEmailSettingsTable from './models/emailSettingsModel.js';
import { adminLogin } from './controllers/authController.js';

// Secret used exclusively for short-lived QR access tokens.
// Kept separate from the admin JWT secret for security isolation.
const QR_SECRET = process.env.QR_SECRET || (process.env.JWT_SECRET || 'nits_academy_secret_key_2024') + '_QR_ACCESS';


const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

createTables();
createLocationSettingsTable(); // <-- INITIALIZE NEW TABLE
createEmailSettingsTable();

// Auth Route
app.post('/api/admin/login', adminLogin);

// Student Portal Routes
app.use('/api/student', studentRoutes);


// ============================================================
// QR TOKEN ROUTES — Attendance Page Access Control
// ============================================================
// These are PUBLIC routes (no admin auth required).
// They manage short-lived tokens that allow students to access
// the face-scanner page ONLY via a valid QR code scan.

// ------------------------------------------------------------
// GET /api/qr-token
// Called by the admin's ScannerPage to generate a daily token.
// Token is valid for 24 hours so a printed/downloaded QR works
// for the entire working day without needing to be refreshed.
// The 5-minute per-student session is handled client-side in
// the attendance page once a student scans and the page opens.
// ------------------------------------------------------------
app.get('/api/qr-token', (req, res) => {
    const token = jwt.sign(
        { type: 'qr_attendance_access' },   // Identifies this as a QR access token
        QR_SECRET,
        { expiresIn: '24h' }                // Valid for the whole working day
    );
    return res.json({ token });
});


// ------------------------------------------------------------
// POST /api/verify-qr-token
// Called by the student's browser when the attendance page loads.
// Verifies that the ?token= in the URL is genuine and not expired.
// Returns { valid: true } or { valid: false, reason: '...' }
// ------------------------------------------------------------
app.post('/api/verify-qr-token', (req, res) => {
    const { token } = req.body;

    // Token must be present in the request body
    if (!token) {
        return res.json({ valid: false, reason: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, QR_SECRET);

        // Extra check: ensure this is specifically a QR access token
        // (not an admin token or any other JWT accidentally passed)
        if (decoded.type !== 'qr_attendance_access') {
            return res.json({ valid: false, reason: 'Invalid token type.' });
        }

        return res.json({ valid: true });

    } catch (err) {
        // jwt.verify throws if the token is expired or has a bad signature
        const reason = err.name === 'TokenExpiredError'
            ? 'QR code has expired. Please ask admin to refresh the scanner page.'
            : 'Invalid or tampered token.';
        return res.json({ valid: false, reason });
    }
});


const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        let folder = '';

        if (file.fieldname === 'photo') {
            folder = 'uploads/student_photo/';
        }
        else {
            folder = 'uploads/student_cv/';
        }

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);
    },

    filename: (req, file, cb) => {

        const studentName = req.body.fullName
            ? req.body.fullName.replace(/\s+/g, '_').toLowerCase()
            : 'student';

        let ext = path.extname(file.originalname);

        if (!ext) {
            ext = ".jpg";
        }

        const newFileName = `${studentName}_${Date.now()}${ext}`;

        cb(null, newFileName);

    }

});

const upload = multer({ storage: storage });


// ---------------- ROUTES ----------------

// Use modular Admin Routes
app.use('/api/admin/attendance', attendanceRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/location-settings', locationSettingsRoutes); // <-- REGISTER BRAND NEW ROUTES
app.use('/api/email-settings', emailSettingsRoutes);

// Use Exam Routes
app.use('/api/exam', examRoutes);


// get courses
app.get('/api/courses', (req, res) => {

    Db.query("SELECT * FROM course ORDER BY sr_no ASC", (err, results) => {

        if (err) return res.status(500).json({ error: err.message });

        res.json(results);

    });

});


// get internships
app.get('/api/interns', (req, res) => {

    Db.query("SELECT * FROM intern ORDER BY sr_no ASC", (err, results) => {

        if (err) return res.status(500).json({ error: err.message });

        res.json(results);

    });

});


// get branch and degrees
app.get('/api/branches', (req, res) => {
    Db.query("SELECT * FROM branch_and_degree ORDER BY sr_no ASC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ---------------- REGISTER ----------------

app.post('/api/register', upload.fields([{ name: 'photo' }, { name: 'resume' }]), (req, res) => {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { fullName, email, phone, address, college, branch, year, type, domain, collage_course, iid } = req.body;

    const photoName = req.files?.photo?.[0]?.filename || null;
    const resumeName = req.files?.resume?.[0]?.filename || null;

    // ---------- CHECK IF STUDENT ALREADY EXISTS ----------
    // FIXED: Check if the user email, phone, or name already is registered to prevent duplicate form submissions.
    const checkSql = "SELECT sid, full_name, email, phone FROM student WHERE email = ? OR phone = ? OR full_name = ?";
    Db.query(checkSql, [email, phone, fullName], (checkErr, checkResult) => {
        if (checkErr) {
            return res.status(500).json({ error: "Database Check Failed: " + checkErr.message });
        }

        if (checkResult.length > 0) {
            // Student already exists! Delete the currently uploaded photos since they are duplicates.
            if (photoName && fs.existsSync(`uploads/student_photo/${photoName}`)) {
                fs.unlinkSync(`uploads/student_photo/${photoName}`);
            }
            if (resumeName && fs.existsSync(`uploads/student_cv/${resumeName}`)) {
                fs.unlinkSync(`uploads/student_cv/${resumeName}`);
            }

            // Determine exactly which field caused the conflict
            const existing = checkResult[0];
            let conflictField = "";
            if (existing.email === email) conflictField = "Email";
            else if (existing.phone === phone) conflictField = "Phone Number";
            else if (existing.full_name === fullName) conflictField = "Full Name";

            return res.status(409).json({
                message: `You have already registered previously with this ${conflictField}! Duplicate registration is not allowed.`,
                field: conflictField.toLowerCase().split(" ")[0] // 'email', 'phone', or 'full'
            });
        }

        // ---------- INSERT STUDENT (Only reaches here if no duplicate exists) ----------

        const studentSql = `
    INSERT INTO student 
    (full_name, email, phone, address, college_name, branch, collage_course, year, user_img, resume) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const studentValues = [
            fullName,
            email,
            phone,
            address,
            college,
            branch,
            collage_course,
            year,
            photoName,
            resumeName
        ];

        Db.query(studentSql, studentValues, (err, result) => {

            if (err) {

                // delete uploaded files if DB error
                // FIXED: Added fs.existsSync check before deleting files to prevent the Node server from crashing if the file doesn't exist.
                if (photoName && fs.existsSync(`uploads/student_photo/${photoName}`)) {
                    fs.unlinkSync(`uploads/student_photo/${photoName}`);
                }

                if (resumeName && fs.existsSync(`uploads/student_cv/${resumeName}`)) {
                    fs.unlinkSync(`uploads/student_cv/${resumeName}`);
                }

                return res.status(500).json({
                    error: "Student Insert Failed: " + err.message
                });

            }

            const studentId = result.insertId;

            // ---------- ENROLLMENT AND CERTIFICATE GENERATION ----------

            // FIXED: Generate dynamic certificate number
            // Format: NITS/[Type]/[ReverseDate]/[Padding_SID]
            // Examples: NITS/AC/260307/0001 or NITS/IS_45/260307/0001

            const today = new Date();
            const yy = String(today.getFullYear()).slice(-2);
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const reverseDate = `${yy}${mm}${dd}`; // e.g., 260307

            const paddedId = String(studentId).padStart(4, '0'); // e.g., 0001

            let prefix = "AC"; // Default for Course (Academic Course)
            let internshipDuration = "";

            // To accurately get IS_45, IS_90, we run a swift query for the internship duration.
            const processEnrollment = (certPrefix) => {
                const certNo = `NITS/${certPrefix}/${reverseDate}/${paddedId}`;

                const enrollmentSql = `
            INSERT INTO enrollment 
            (sid, cid, iid, type, certificate_no, enrollment_date) 
            VALUES (?, ?, ?, ?, ?, CURDATE())`;

                // Ensure empty strings are sent as explicitly NULL to satisfy MySQL Foreign Key Constraints
                // If domain is provided, parse it to Integer. Otherwise use raw null.
                const cid = (domain && domain !== "null" && domain.trim() !== "") ? parseInt(domain, 10) : null;
                const internId = (type === "internship" && iid && iid !== "null" && iid.trim() !== "") ? parseInt(iid, 10) : null;

                Db.query(enrollmentSql, [studentId, cid, internId, type, certNo], (err, enrollmentResult) => {

                    if (err) {
                        // FIXED: Rollback step. 
                        Db.query("DELETE FROM student WHERE sid = ?", [studentId]);

                        if (photoName && fs.existsSync(`uploads/student_photo/${photoName}`)) {
                            fs.unlinkSync(`uploads/student_photo/${photoName}`);
                        }
                        if (resumeName && fs.existsSync(`uploads/student_cv/${resumeName}`)) {
                            fs.unlinkSync(`uploads/student_cv/${resumeName}`);
                        }

                        return res.status(500).json({
                            error: "Enrollment Failed: " + err.message
                        });
                    }

                    const eid = enrollmentResult.insertId; // Get the newly inserted enrollment ID

                    // ---------- RETURN SUCCESS (EXCEL LOGIC REMOVED) ----------
                    res.json({
                        message: "✅ Success! Student Registered Successfully.",
                        studentId: studentId,
                        certificateNo: certNo
                    });
                });
            };

            if (type === "internship" && iid !== "null" && iid !== null) {
                Db.query("SELECT duration FROM intern WHERE iid = ?", [iid], (err, internResults) => {
                    if (!err && internResults.length > 0) {
                        // Assuming 'duration' stores "45 Days", "90 Days", or similar
                        let durationInt = parseInt(internResults[0].duration);
                        if (isNaN(durationInt)) durationInt = internResults[0].duration.split(' ')[0]; // fallback
                        processEnrollment(`IS/${durationInt}`);
                    } else {
                        processEnrollment("IS/UNKNOWN");
                    }
                });
            } else {
                // It's a regular 'course'
                processEnrollment("AC");
            }

        });

    }); // <-- Closing bracket for the checkSql callback!

});


// ---------------- FACE RECOGNITION DATA ----------------

app.post('/api/save-face-data', (req, res) => {
    const { studentId, faceData } = req.body;

    if (!studentId || !faceData) {
        return res.status(400).json({ error: "Missing Student ID or Face Data." });
    }

    // Process faceData (array of 128 floats) into a JSON string for LONGTEXT column
    const faceDescriptorJson = JSON.stringify(faceData);

    // Save the face data but mark the student as PENDING (PIN will be generated on admin approval)
    const insertFaceData = () => {
        const insertSql = "INSERT INTO student_auth (sid, face_descriptor, status) VALUES (?, ?, 'PENDING')";
        Db.query(insertSql, [studentId, faceDescriptorJson], (insertErr) => {
            if (insertErr) return res.status(500).json({ error: "Failed to save face blueprint: " + insertErr.message });

            return res.json({ message: "Face scan saved successfully. Pending Admin Approval." });
        });
    };

    const checkSql = "SELECT * FROM student_auth WHERE sid = ?";
    Db.query(checkSql, [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error checking attendance" });

        if (results.length > 0) {
            // Update existing record (if they are scanning face again for some reason)
            // We usually don't need to generate a new 5-digit token if they already have one, just update the face data.
            const updateSql = "UPDATE student_auth SET face_descriptor = ? WHERE sid = ?";
            Db.query(updateSql, [faceDescriptorJson, studentId], (updateErr) => {
                if (updateErr) return res.status(500).json({ error: "Failed to update face data: " + updateErr.message });
                return res.json({ message: "Face data updated successfully." });
            });
        } else {
            // New user: Insert face data as PENDING
            insertFaceData();
        }
    });
});


// ---------------- FETCH SINGLE FACE FOR VERIFICATION (SCALABLE) ----------------

app.get('/api/student-face/:pin', async (req, res) => {
    const { pin } = req.params;

    try {
        const sql = `
            SELECT s.sid, s.full_name, sa.face_descriptor, sa.status 
            FROM student s
            JOIN student_auth sa ON s.sid = sa.sid
            WHERE sa.pin = ?
        `;

        const [results] = await Db.promise().query(sql, [pin]);

        if (results.length === 0) {
            return res.status(404).json({ error: "Invalid PIN. Student not found." });
        }

        const student = results[0];

        // Check today's attendance status
        const options = { timeZone: 'Asia/Kolkata' };
        const attendanceDate = new Date().toLocaleDateString('en-CA', options);
        
        const attendanceSql = "SELECT in_time, out_time FROM attendance_log WHERE sid = ? AND attendance_date = ?";
        const [attResults] = await Db.promise().query(attendanceSql, [student.sid, attendanceDate]);

        let hasIn = false;
        let hasOut = false;
        let inTime = null;

        if (attResults.length > 0) {
            hasIn = !!attResults[0].in_time;
            hasOut = !!attResults[0].out_time;
            inTime = attResults[0].in_time;
        }

        res.json({
            studentId: student.sid,
            fullName: student.full_name,
            faceData: JSON.parse(student.face_descriptor),
            status: student.status,
            hasIn,
            hasOut,
            inTime
        });

    } catch (err) {
        console.error("Fetch Student Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ---------------- CANCEL REGISTRATION (DELETE) ----------------

app.delete('/api/student/:id', (req, res) => {
    const studentId = req.params.id;

    if (!studentId) {
        return res.status(400).json({ error: "Student ID missing" });
    }

    // Step 1: Find the student's uploaded files and Excel file to delete them
    const selectSql = `
        SELECT s.user_img, s.resume, s.full_name, e.exal_file, sa.pin 
        FROM student s 
        LEFT JOIN enrollment e ON s.sid = e.sid 
        LEFT JOIN student_auth sa ON s.sid = sa.sid
        WHERE s.sid = ?`;

    Db.query(selectSql, [studentId], async (err, results) => {
        if (!err && results.length > 0) {
            const { user_img, resume, full_name, exal_file, present_unic_no } = results[0];

            // Delete physical profile files
            if (user_img && fs.existsSync(`uploads/student_photo/${user_img}`)) {
                fs.unlinkSync(`uploads/student_photo/${user_img}`);
            }
            if (resume && fs.existsSync(`uploads/student_cv/${resume}`)) {
                fs.unlinkSync(`uploads/student_cv/${resume}`);
            }

            // Function to perform the final database cleanup
            const executeDbDelete = () => {
                Db.query("DELETE FROM enrollment WHERE sid = ?", [studentId], () => {
                    Db.query("DELETE FROM student_auth WHERE sid = ?", [studentId], () => {
                        Db.query("DELETE FROM student WHERE sid = ?", [studentId], (delErr) => {
                            if (delErr) return res.status(500).json({ error: "Failed to delete student: " + delErr.message });
                            return res.json({ message: "Student record, files, and Excel entry successfully deleted." });
                        });
                    });
                });
            };

            // Execute database deletion (EXCEL DELETION LOGIC REMOVED)
            executeDbDelete();
        } else {
            return res.status(404).json({ error: "Student not found in DB" });
        }
    });
});


// ---------------- MARK ATTENDANCE (IN/OUT) ----------------

app.post('/api/mark-attendance', async (req, res) => {
    const { pin, type, topic } = req.body; // type is 'in' or 'out'

    if (!pin || !type) {
        return res.status(400).json({ error: "Missing PIN or Attendance Type." });
    }

    try {
        // Step 1: Look up the student in DB
        const sql = `
            SELECT s.sid, s.full_name, e.enrollment_date, e.exal_file
            FROM student s
            JOIN student_auth sa ON s.sid = sa.sid
            JOIN enrollment e ON s.sid = e.sid
            WHERE sa.pin = ?
        `;

        const [results] = await Db.promise().query(sql, [pin]);
        if (results.length === 0) {
            return res.status(404).json({ error: "Invalid PIN or Student Enrollment not found." });
        }
        const student = results[0];
        const today = new Date();
        
        // --- 1. PREPARE DATA ---
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const attendanceDate = now.toLocaleDateString('en-CA', options);
        const currentTimeAMPM = now.toLocaleTimeString('en-US', { ...options, hour: '2-digit', minute: '2-digit', hour12: true });

        console.log(`[ATTENDANCE] PIN: ${pin}, Type: ${type}, Time: ${currentTimeAMPM}, Date: ${attendanceDate}`);

        let excelStatus = 'P'; // Default status for Excel
        let shouldUpdateExcel = false; // Only update Excel in certain cases
        let responseMsg = `Attendance (${type.toUpperCase()}) marked successfully!`;

        if (type === 'in') {
            const inSql = `
                INSERT INTO attendance_log (sid, attendance_date, in_time, topic)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE in_time = ?, topic = ?
            `;
            await Db.promise().query(inSql, [student.sid, attendanceDate, currentTimeAMPM, topic, currentTimeAMPM, topic]);
            console.log(`[ATTENDANCE] IN-punch recorded for student ${student.sid}`);
            
            shouldUpdateExcel = true;
            excelStatus = 'P';

        } else if (type === 'out') {
            const fetchInTimeSql = "SELECT in_time FROM attendance_log WHERE sid = ? AND attendance_date = ?";
            const [fetchResults] = await Db.promise().query(fetchInTimeSql, [student.sid, attendanceDate]);

            let finalTotalHours = "00:00";
            let finalTopic = topic;

            if (fetchResults.length > 0 && fetchResults[0].in_time) {
                const inTimeString = fetchResults[0].in_time;
                
                // Helper to parse "HH:mm AM/PM" to total minutes in the day
                // Enhanced with regex to handle different spaces (\s+) and case-insensitivity
                const parseToMinutes = (timeStr) => {
                    if (!timeStr) return 0;
                    const parts = timeStr.trim().split(/\s+/);
                    if (parts.length < 2) return 0;
                    
                    const timePart = parts[0];
                    const modifier = parts[1].toUpperCase().replace(/\./g, ''); // Handles PM, pm, P.M. etc.
                    
                    let [hours, minutes] = timePart.split(':').map(val => parseInt(val, 10));
                    if (modifier === 'PM' && hours < 12) hours += 12;
                    if (modifier === 'AM' && hours === 12) hours = 0;
                    return hours * 60 + (minutes || 0);
                };

                const inMins = parseToMinutes(inTimeString);
                const outMins = parseToMinutes(currentTimeAMPM);
                
                const diffMins = outMins - inMins;
                console.log(`[ATTENDANCE] CALC: In=${inTimeString}(${inMins}), Out=${currentTimeAMPM}(${outMins}), Diff=${diffMins} mins`);

                if (diffMins < 120 && diffMins >= 0) {
                    const remaining = 120 - diffMins;
                    return res.status(400).json({ error: `You can only mark OUT after 2 hours. Remaining time: ${remaining} minutes.` });
                }

                if (diffMins > 720 || diffMins < 0) {
                    finalTotalHours = "N/A";
                    finalTopic = "......";
                    excelStatus = "A"; 
                    shouldUpdateExcel = true; // Overwrite 'P' with 'A'
                    responseMsg = diffMins < 0 
                        ? `Out-punch recorded at ${currentTimeAMPM}, but In-punch was at ${inTimeString}. Duration cannot be negative. Marked as Absent.` 
                        : "Out time recorded, but duration exceeded 12h. Marked as Absent.";
                    console.warn(`[ATTENDANCE] WARNING: ${responseMsg}`);
                } else {
                    const hh = Math.floor(diffMins / 60).toString().padStart(2, '0');
                    const mm = (diffMins % 60).toString().padStart(2, '0');
                    finalTotalHours = `${hh}:${mm}`;
                    shouldUpdateExcel = false; // Already marked 'P' at IN
                    console.log(`[ATTENDANCE] Duration calculated: ${finalTotalHours}`);
                }
            } else {
                // No IN time, but they are punching OUT
                console.warn(`[ATTENDANCE] No IN-punch found for PIN ${pin} on ${attendanceDate}`);
                excelStatus = "A";
                finalTotalHours = "N/A";
                finalTopic = topic; // Store the actual topic they entered
                shouldUpdateExcel = true; // Mark 'A' because they missed 'IN'
                responseMsg = "Out-punch recorded, but no IN-punch found for today. Marked as Absent.";
            }

            const outSql = `
                INSERT INTO attendance_log (sid, attendance_date, out_time, total_hours, topic)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE out_time = ?, total_hours = ?, topic = ?
            `;
            await Db.promise().query(outSql, [
                student.sid, attendanceDate, currentTimeAMPM, finalTotalHours, finalTopic,
                currentTimeAMPM, finalTotalHours, finalTopic
            ]);
            console.log(`[ATTENDANCE] OUT-punch finalized for student ${student.sid} with total_hours: ${finalTotalHours}`);
        }

        // --- 2. UPDATE BATCH-WISE PERSISTENT ATTENDANCE (Excel) ---
        if (shouldUpdateExcel && student.exal_file) {
            // Extract year from filename (format: Month_Year.xlsx)
            const fileParts = student.exal_file.split('_');
            const yearStr = fileParts[1].split('.')[0]; 
            const yearlyFilePath = path.join(process.cwd(), 'attendance', 'yearly_exl_file', yearStr, student.exal_file);

            if (fs.existsSync(yearlyFilePath)) {
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.readFile(yearlyFilePath);
                const worksheet = workbook.getWorksheet('Attendance');

                if (worksheet) {
                    // 1. Resolve Today's Date Label
                    const dayNum = now.getDate();
                    const monthNum = now.getMonth() + 1;
                    const fullYear = now.getFullYear();
                    const shortDay = now.toLocaleString('default', { weekday: 'short' });
                    const todayLabel = `${dayNum}/${monthNum}/${fullYear} [${shortDay}]`;

                    // 2. Find or Create Column for Today (Monthly Block Expansion)
                    const headerRow = worksheet.getRow(1);
                    let colIndex = -1;
                    let lastDateHeader = '';
                    let lastDateColIndex = 4; // Start after Domain column

                    headerRow.eachCell((cell, colNumber) => {
                        const cellValue = cell.value ? cell.value.toString() : '';
                        if (cellValue === todayLabel) colIndex = colNumber;
                        if (cellValue.includes('/') && cellValue.includes('[')) {
                            lastDateHeader = cellValue;
                            lastDateColIndex = colNumber;
                        }
                    });

                    if (colIndex === -1) {
                        // Not found, so we need to add a new block of 30 days
                        let nextStartDate = new Date();
                        if (lastDateHeader) {
                            // Extract date from "10/3/2026 [Tue]"
                            const [datePart] = lastDateHeader.split(' ');
                            const [d, m, y] = datePart.split('/');
                            nextStartDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d) + 1);
                        }

                        // Add 30 new columns
                        for (let i = 0; i < 30; i++) {
                            const newDate = new Date(nextStartDate);
                            newDate.setDate(nextStartDate.getDate() + i);

                            const d = newDate.getDate();
                            const m = newDate.getMonth() + 1;
                            const y = newDate.getFullYear();
                            const day = newDate.toLocaleString('default', { weekday: 'short' });
                            const newLabel = `${d}/${m}/${y} [${day}]`;

                            const newColIndex = lastDateColIndex + 1 + i;
                            const cell = headerRow.getCell(newColIndex);
                            cell.value = newLabel;
                            cell.font = { bold: true };

                            // Color Sundays
                            if (newLabel.includes('[Sun]')) {
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'FFFFFFE0' }
                                };
                            }

                            // If this new column is today, store its index
                            if (newLabel === todayLabel) colIndex = newColIndex;
                        }
                    }

                    // 3. Find Student Row and Mark 'P' (Excel marking)
                    let studentRowNumber = -1;
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber > 1 && row.getCell(1).value == pin) {
                            studentRowNumber = rowNumber;
                        }
                    });

                    if (studentRowNumber !== -1) {
                        const studentRow = worksheet.getRow(studentRowNumber);
                        studentRow.getCell(colIndex).value = excelStatus;
                        
                        // Color cell if Sunday
                        if (todayLabel.includes('[Sun]')) {
                            studentRow.getCell(colIndex).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFFFFE0' }
                            };
                        }
                        
                        await workbook.xlsx.writeFile(yearlyFilePath);
                    }
                }
            }
        }

        return res.json({ message: responseMsg });

    } catch (err) {
        console.error("Attendance Error:", err);
        return res.status(500).json({ error: "Internal server error during attendance update." });
    }
});


// ---------------- SERVER ----------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});