import Db from '../config/db.js';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

// Get list of pending students who have registered but have not been verified
export const getPendingStudents = (req, res) => {
    // Get students who HAVE registered and scanned their face, but their status is PENDING
    const query = `
        SELECT s.sid, s.full_name, s.email, s.phone, s.user_img, s.college_name, 
               sa.pin, sa.status,
               e.type as enrollment_type,
               c.course_name
        FROM student s
        JOIN student_auth sa ON s.sid = sa.sid
        LEFT JOIN enrollment e ON s.sid = e.sid
        LEFT JOIN course c ON e.cid = c.cid
        WHERE sa.status = 'PENDING'
        ORDER BY s.sid DESC
    `;

    Db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching pending students:", err);
            return res.status(500).json({ error: "Database error fetching students" });
        }
        res.json(results);
    });
};

// POST: Approve student, generate PIN, and add to Excel
export const approveStudent = (req, res) => {
    const { studentId } = req.body;
    if (!studentId) {
        return res.status(400).json({ error: "Student ID missing" });
    }

    // 1. Generate unique 6 digit number
    const generateUniquePin = () => {
        const random6Digit = Math.floor(100000 + Math.random() * 900000);

        Db.query("SELECT said FROM student_auth WHERE pin = ?", [random6Digit], (dupErr, dupResult) => {
            if (dupErr) return res.status(500).json({ error: "Failed to check token uniqueness" });

            if (dupResult.length > 0) {
                // If exists, try again
                generateUniquePin();
            } else {
                updateStudentStatusAndExcel(random6Digit);
            }
        });
    };

    // 2. Update DB and Excel
    const updateStudentStatusAndExcel = (pin) => {
        const updateSql = "UPDATE student_auth SET pin = ?, status='ACTIVE' WHERE sid = ?";
        Db.query(updateSql, [pin, studentId], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: "Failed to approve student in Database" });

            // IMPORTANT: Synchronize enrollment_date to approval date for accurate Excel tracking
            Db.query("UPDATE enrollment SET enrollment_date = CURDATE() WHERE sid = ?", [studentId]);

            // Fetch student data to save in Excel (Name, Type/Course, Branch/Domain) AND email for sending
            const fetchSql = `
                SELECT s.full_name, s.email, c.course_name, e.type 
                FROM student s 
                LEFT JOIN enrollment e ON s.sid = e.sid 
                LEFT JOIN course c ON e.cid = c.cid
                WHERE s.sid = ?
            `;
            Db.query(fetchSql, [studentId], async (dataErr, dataResults) => {
                const studentData = (dataResults && dataResults.length > 0) ? dataResults[0] : {};
                const studentName = studentData.full_name || "Unknown Student";
                const courseType = studentData.type || "Course";
                const domain = studentData.course_name || "N/A";
                
                const joiningDateObj = new Date();
                const joiningDateStr = `${joiningDateObj.getDate()}/${joiningDateObj.getMonth()+1}/${joiningDateObj.getFullYear()}`;

                try {
                    // --- YEARLY/MONTHLY EXCEL LOGIC (Old simpler format tracker) ---
                    await addToYearlyExcel(pin, studentName, courseType, domain, joiningDateObj);
                    
                    // Update enrollment table with the filename
                    const month = joiningDateObj.toLocaleString('default', { month: 'long' });
                    const year = joiningDateObj.getFullYear();
                    const excelFileName = `${month}_${year}.xlsx`;
                    Db.query("UPDATE enrollment SET exal_file = ? WHERE sid = ?", [excelFileName, studentId]);

                    // --- SEND RESPONSE IMMEDIATELY ---
                    res.json({ message: "Student Approved & Excel Updated!", pin: pin });

                    // --- SEND EMAIL IN BACKGROUND (non-blocking) ---
                    const emailQuery = "SELECT smtp_email, smtp_password FROM email_settings WHERE id = 1 AND smtp_email != '' AND smtp_password != ''";
                    Db.query(emailQuery, (emailErr, emailRes) => {
                        if (emailErr || emailRes.length === 0) {
                            console.log('Email skipped: Email config missing or DB error.');
                            return;
                        }

                        const { smtp_email, smtp_password } = emailRes[0];
                        const studentEmail = studentData.email;

                        if (!studentEmail) {
                            console.log('Email skipped: Student has no email address.');
                            return;
                        }

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: smtp_email,
                                pass: smtp_password
                            }
                        });

                        const mailOptions = {
                            from: `"NITS Academy" <${smtp_email}>`,
                            to: studentEmail,
                            subject: 'Registration Approved - Welcome to NITS Academy!',
                            html: `
                                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                                    <h2 style="color: #1a237e; border-bottom: 2px solid #ebf8ff; padding-bottom: 10px;">Registration Approved</h2>
                                    
                                    <p>Dear <strong>${studentName}</strong>,</p>
                                    <p>Your registration at NITS Academy has been successfully approved.</p>
                                    
                                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                                        <p style="margin: 5px 0;"><strong>Course / Type:</strong> ${courseType}</p>
                                        <p style="margin: 5px 0;"><strong>Domain:</strong> ${domain}</p>
                                        <br/>
                                        <h3 style="margin-top: 10px; color: #1e293b;">Your Unique Login PIN</h3>
                                        <div style="font-size: 2em; letter-spacing: 5px; color: #d97706; font-weight: bold; padding: 10px; background: #fff; border: 1px dashed #cbd5e1; display: inline-block;">
                                            ${pin}
                                        </div>
                                    </div>

                                    <h3 style="color: #1a237e; margin-top: 25px;">Important Notes:</h3>
                                    <ul style="line-height: 1.6;">
                                        <li>You must use this 6-digit PIN to mark your daily attendance on the lab scanner.</li>
                                        <li>You can view your portfolio and attendance records.</li>
                                        <li>You can attempt assigned exams using this PIN.</li>
                                    </ul>

                                    <div style="margin-top: 25px;">
                                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/student/login" 
                                           style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                           Go to Student Login
                                        </a>
                                    </div>

                                    <div style="margin-top: 30px; padding: 15px; background-color: #fee2e2; border-left: 4px solid #ef4444; color: #991b1b;">
                                        <strong>⚠️ Warning:</strong> Please do not share this PIN or your code with anyone. It is for your personal access only.
                                    </div>

                                    <p style="margin-top: 30px; font-size: 0.9em; color: #64748b;">
                                        Best Regards,<br/><strong>NITS Academy Admin Team</strong>
                                    </p>
                                </div>
                            `
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('❌ Background email FAILED:', error.message);
                            } else {
                                console.log('✅ Background email SENT successfully:', info.response);
                            }
                        });
                    });

                } catch (excelError) {
                    console.error("Excel update Error:", excelError);
                    return res.json({ message: "Student Approved in DB, but Excel update failed.", pin: pin });
                }
            });
        });
    };

    // Trigger the flow
    generateUniquePin();
};

// Helper: Function to add a student to the Yearly Excel Sheet (Month wise)
const addToYearlyExcel = async (pin, studentName, courseType, domain, dateObj = new Date()) => {
    const year = dateObj.getFullYear();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    
    // Directory structure: backend/attendance/yearly_exl_file/2026/
    const folderPath = path.join(process.cwd(), 'attendance', 'yearly_exl_file', String(year));
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    
    const filePath = path.join(folderPath, `${month}_${year}.xlsx`);
    
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    const setupMonthColumns = (ws, startDate = new Date()) => {
        const columns = [
            { header: 'ID', key: 'id', width: 12 },
            { header: 'Name', key: 'name', width: 32 },
            { header: 'Course/Intern', key: 'type', width: 15 },
            { header: 'Domain', key: 'domain', width: 20 }
        ];

        // Generate 30 consecutive days starting from startDate
        for (let i = 0; i < 30; i++) {
            const columnDate = new Date(startDate);
            columnDate.setDate(startDate.getDate() + i);
            
            const dayNum = columnDate.getDate();
            const monthNum = columnDate.getMonth() + 1;
            const fullYear = columnDate.getFullYear();
            const shortDay = columnDate.toLocaleString('default', { weekday: 'short' });
            
            const dateLabel = `${dayNum}/${monthNum}/${fullYear} [${shortDay}]`;
            columns.push({ header: dateLabel, key: `date_${i}`, width: 20 });
        }

        ws.columns = columns;

        // Visual improvements: Bold headers and color Sundays
        const row1 = ws.getRow(1);
        row1.font = { bold: true };
        
        columns.forEach((col, idx) => {
            if (col.header && col.header.includes('[Sun]')) {
                row1.getCell(idx + 1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFE0' } // Light Yellow
                };
            }
        });
    };
    
    if (fs.existsSync(filePath)) {
        await workbook.xlsx.readFile(filePath);
        worksheet = workbook.getWorksheet('Attendance');
        if (!worksheet) {
            worksheet = workbook.addWorksheet('Attendance');
            setupMonthColumns(worksheet, dateObj);
        }
    } else {
        worksheet = workbook.addWorksheet('Attendance');
        setupMonthColumns(worksheet, dateObj);
    }
    
    // Avoid duplicates
    let exists = false;
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1 && row.getCell(1).value == pin) {
            exists = true;
        }
    });

    if (!exists) {
        // Use array-based adding to avoid "missing key" issues in existing files
        worksheet.addRow([pin, studentName, courseType, domain]);
    }
    
    await workbook.xlsx.writeFile(filePath);
};

// DELETE: Reject student (Delete files and DB records)
export const rejectStudent = (req, res) => {
    const studentId = req.params.id;

    if (!studentId) {
        return res.status(400).json({ error: "Student ID missing" });
    }

    const selectSql = `SELECT user_img, resume FROM student WHERE sid = ?`;

    Db.query(selectSql, [studentId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: "Student not found in DB" });
        }

        const { user_img, resume } = results[0];
        
        // Delete physical files
        try {
            if (user_img && fs.existsSync(path.join(process.cwd(), 'uploads', 'student_photo', user_img))) {
                fs.unlinkSync(path.join(process.cwd(), 'uploads', 'student_photo', user_img));
            }
            if (resume && fs.existsSync(path.join(process.cwd(), 'uploads', 'student_cv', resume))) {
                fs.unlinkSync(path.join(process.cwd(), 'uploads', 'student_cv', resume));
            }
        } catch (fileErr) {
            console.error("Error deleting physical files:", fileErr);
            // We proceed to DB deletion even if file deletion fails
        }

        // Delete from database
        Db.query("DELETE FROM enrollment WHERE sid = ?", [studentId], () => {
            Db.query("DELETE FROM student_auth WHERE sid = ?", [studentId], () => {
                Db.query("DELETE FROM student WHERE sid = ?", [studentId], (delErr) => {
                    if (delErr) return res.status(500).json({ error: "Failed to delete student from DB" });
                    return res.json({ message: "Student record and files successfully deleted." });
                });
            });
        });
    });
};

// --- STUDENT MANAGEMENT SYSTEM APIs ---

// 1. Get ALL Students with Filters (Search, Type, Course)
export const getAllStudents = (req, res) => {
    const { search, type, course_id } = req.query;
    
    let query = `
        SELECT s.sid, s.full_name, s.phone, s.email,
               sa.pin, sa.status as auth_status,
               e.type as enrollment_type, e.enrollment_date, e.status as enrollment_status,
               c.course_name
        FROM student s
        LEFT JOIN student_auth sa ON s.sid = sa.sid
        LEFT JOIN enrollment e ON s.sid = e.sid
        LEFT JOIN course c ON e.cid = c.cid
        WHERE 1=1
    `;

    const queryParams = [];

    if (search) {
        query += ` AND (s.full_name LIKE ? OR s.phone LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (type && type !== 'all') {
        query += ` AND e.type = ?`;
        queryParams.push(type);
    }

    if (course_id && course_id !== 'all') {
        query += ` AND e.cid = ?`;
        queryParams.push(course_id);
    }

    query += ` ORDER BY s.sid DESC`;

    Db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error fetching all students:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};

// 2. Get Single Student Full Info
export const getStudentById = (req, res) => {
    const studentId = req.params.id;
    const studentQuery = `
        SELECT s.*, sa.pin, sa.status as auth_status,
               e.type, e.enrollment_date, e.exal_file, e.status as enrollment_status,
               c.course_name, c.cid, c.sr_no as course_sr
        FROM student s
        LEFT JOIN student_auth sa ON s.sid = sa.sid
        LEFT JOIN enrollment e ON s.sid = e.sid
        LEFT JOIN course c ON e.cid = c.cid
        WHERE s.sid = ?
    `;

    Db.query(studentQuery, [studentId], (err, studentResults) => {
        if (err || studentResults.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Fetch attendance logs for this student
        const attendanceQuery = `
            SELECT attendance_date, in_time, out_time, total_hours, topic
            FROM attendance_log
            WHERE sid = ?
            ORDER BY attendance_date DESC
        `;

        Db.query(attendanceQuery, [studentId], (err, attendanceResults) => {
            if (err) {
                console.error("Error fetching attendance for student info:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            res.json({
                profile: studentResults[0],
                attendance: attendanceResults
            });
        });
    });
};


// 3. Update Student Info
export const updateStudent = (req, res) => {
    const studentId = req.params.id;
    const { 
        full_name, email, phone, address, college_name, branch, collage_course, 
        year, type, cid, enrollment_status, auth_status 
    } = req.body;
    console.log("DEBUG: Updating student with enrollment_status:", enrollment_status, "and auth_status:", auth_status);

    const studentUpdateSql = `
        UPDATE student 
        SET full_name=?, email=?, phone=?, address=?, college_name=?, branch=?, collage_course=?, year=?
        WHERE sid=?
    `;
    const studentValues = [full_name, email, phone, address, college_name, branch, collage_course, year, studentId];

    Db.query(studentUpdateSql, studentValues, (err) => {
        if (err) return res.status(500).json({ error: "Failed to update student table" });

        // Check if enrollment record exists
        Db.query("SELECT eid FROM enrollment WHERE sid = ?", [studentId], (checkErr, checkResult) => {
            if (checkErr) return res.status(500).json({ error: "Database error checking enrollment" });

            const finalizeUpdate = () => {
                // Also update student_auth status if provided
                if (auth_status) {
                    Db.query("UPDATE student_auth SET status = ? WHERE sid = ?", [auth_status, studentId], (authErr) => {
                        if (authErr) {
                            console.error("Failed to update student_auth status:", authErr);
                            return res.status(500).json({ error: "Failed to update auth status" });
                        }
                        res.json({ message: "Student information updated successfully" });
                    });
                } else {
                    res.json({ message: "Student information updated successfully" });
                }
            };


            if (checkResult.length > 0) {
                // Update existing
                const enrollUpdateSql = `UPDATE enrollment SET type=?, cid=?, status=? WHERE sid=?`;
                Db.query(enrollUpdateSql, [type, cid, enrollment_status, studentId], (enrollErr) => {
                    if (enrollErr) return res.status(500).json({ error: "Failed to update enrollment table" });
                    finalizeUpdate();
                });
            } else {
                // Create if missing (should normally exist)
                const enrollInsertSql = `INSERT INTO enrollment (sid, type, cid, status, enrollment_date) VALUES (?, ?, ?, ?, CURDATE())`;
                Db.query(enrollInsertSql, [studentId, type, cid, enrollment_status], (insertErr) => {
                    if (insertErr) return res.status(500).json({ error: "Failed to create enrollment record" });
                    finalizeUpdate();
                });
            }
        });

    });
};

// 4. Get All Courses (for filter dropdown)
export const getAllCourses = (req, res) => {
    Db.query("SELECT cid, course_name FROM course ORDER BY course_name ASC", (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch courses" });
        res.json(results);
    });
};

// 5. Dashboard Summary Stats
export const getDashboardStats = (req, res) => {
    const queries = {
        totalStudents: "SELECT COUNT(*) as count FROM student",
        pendingApprovals: "SELECT COUNT(*) as count FROM student_auth WHERE status = 'PENDING'",
        todayAttendance: "SELECT COUNT(DISTINCT sid) as count FROM attendance_log WHERE attendance_date = CURDATE()",
        totalSubjects: "SELECT COUNT(*) as count FROM subjects",
        totalCourses: "SELECT COUNT(*) as count FROM course"
    };

    let stats = {};
    let pendingQueries = Object.keys(queries).length;
    let hasError = false;

    for (let key in queries) {
        Db.query(queries[key], (err, results) => {
            if (err) {
                if (!hasError) {
                    hasError = true;
                    console.error("Dashboard Stats Error:", err);
                    return res.status(500).json({ error: "Failed to fetch dashboard stats" });
                }
                return;
            }
            stats[key] = results[0].count || 0;
            pendingQueries--;

            if (pendingQueries === 0 && !hasError) {
                res.json(stats);
            }
        });
    }
};
