import Db from '../config/db.js';
import jwt from 'jsonwebtoken';

/**
 * studentLogin
 * Authenticates student using Email/Phone and 6-digit PIN.
 * Returns a JWT token upon successful login.
 */
export const studentLogin = (req, res) => {
    const { identifier, pin } = req.body; // identifier can be email or phone

    if (!identifier || !pin) {
        return res.status(400).json({ error: "Email/Phone and PIN are required." });
    }

    // Query to check student and their PIN along with enrollment status
    const sql = `
        SELECT s.sid, s.full_name, s.email, s.phone, sa.pin, e.status as enrollment_status
        FROM student s
        JOIN student_auth sa ON s.sid = sa.sid
        LEFT JOIN enrollment e ON s.sid = e.sid
        WHERE (s.email = ? OR s.phone = ?) AND sa.pin = ? AND sa.status = 'ACTIVE'
        ORDER BY e.eid DESC LIMIT 1
    `;

    Db.query(sql, [identifier, identifier, pin], (err, results) => {
        if (err) {
            console.error("Login Error:", err);
            return res.status(500).json({ error: "Internal server error." });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid credentials or account not active." });
        }

        const student = results[0];

        // Check enrollment status
        if (student.enrollment_status === 'completed') {
            return res.status(403).json({ error: "Your course is completed." });
        }

        // Generate JWT Token for student
        const token = jwt.sign(
            { sid: student.sid, role: 'student' },
            process.env.JWT_SECRET || 'nits_academy_secret_key_2024',
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            token,
            student: {
                sid: student.sid,
                full_name: student.full_name,
                email: student.email
            }
        });
    });
};

/**
 * getStudentProfile
 * Fetches student personal details and their complete attendance history.
 */
export const getStudentProfile = (req, res) => {
    const sid = req.student.sid; // From verifyStudent middleware

    // 1. Fetch Student Details (with enrollment type)
    const studentSql = `
        SELECT s.full_name, s.email, s.phone, s.address, s.college_name, s.branch, s.collage_course, s.year, s.user_img, e.type as admission_type
        FROM student s
        LEFT JOIN enrollment e ON s.sid = e.sid
        WHERE s.sid = ?
    `;

    Db.query(studentSql, [sid], (err, studentResults) => {
        if (err) return res.status(500).json({ error: "Error fetching student info." });
        if (studentResults.length === 0) return res.status(404).json({ error: "Student not found." });

        // 2. Fetch Attendance History (Vertical timeline)
        const attendanceSql = `
            SELECT attendance_date, in_time, out_time, total_hours, topic
            FROM attendance_log
            WHERE sid = ?
            ORDER BY attendance_date DESC
        `;

        Db.query(attendanceSql, [sid], (err, attendanceResults) => {
            if (err) return res.status(500).json({ error: "Error fetching attendance logs." });

            res.json({
                profile: studentResults[0],
                attendance: attendanceResults
            });
        });
    });
};
