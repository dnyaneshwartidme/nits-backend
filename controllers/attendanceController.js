import Db from '../config/db.js';
import ExcelJS from 'exceljs';
import fs from 'fs';       // File system — folders va files read karnyasathi
import path from 'path';   // Path join karnyasathi (OS-safe)

// Get all attendance logs for all students with filtering
export const getAllAttendance = (req, res) => {
    const { search, type, course_id } = req.query;
    console.log("Fetching attendance with filters:", { search, type, course_id });

    let query = `
        SELECT al.sid, al.attendance_date, al.in_time, al.out_time, al.total_hours, al.topic,
               s.full_name, s.phone,
               e.type as enrollment_type,
               c.course_name
        FROM attendance_log al
        LEFT JOIN student s ON al.sid = s.sid
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

    query += ` ORDER BY al.attendance_date DESC, s.full_name ASC`;

    Db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error fetching all attendance:", err);
            return res.status(500).json({ error: "Failed to fetch attendance logs" });
        }
        console.log(`Found ${results.length} attendance records`);
        res.json(results);
    });
};

export const downloadAttendanceExcel = async (req, res) => {
    const { search, type, course_id } = req.query;

    let query = `
        SELECT al.sid, al.attendance_date, al.in_time, al.out_time, al.total_hours, al.topic,
               s.full_name, s.phone,
               e.type as enrollment_type,
               c.course_name
        FROM attendance_log al
        LEFT JOIN student s ON al.sid = s.sid
        LEFT JOIN enrollment e ON s.sid = e.sid
        LEFT JOIN course c ON e.cid = c.cid
        WHERE 1=1
    `;

    const queryParams = [];
    if (search) { query += ` AND (s.full_name LIKE ? OR s.phone LIKE ?)`; queryParams.push(`%${search}%`, `%${search}%`); }
    if (type && type !== 'all') { query += ` AND e.type = ?`; queryParams.push(type); }
    if (course_id && course_id !== 'all') { query += ` AND e.cid = ?`; queryParams.push(course_id); }

    query += ` ORDER BY al.attendance_date DESC, s.full_name ASC`;

    Db.query(query, queryParams, async (err, results) => {
        if (err) return res.status(500).json({ error: "Excel generation failed" });

        const workbook = new ExcelJS.Workbook();
        
        // Group data by Month-Year (e.g., "March 2026")
        const groupedData = results.reduce((acc, log) => {
            const date = new Date(log.attendance_date);
            const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            if (!acc[monthYear]) acc[monthYear] = {};
            
            if (!acc[monthYear][log.sid]) {
                acc[monthYear][log.sid] = {
                    name: log.full_name,
                    phone: log.phone,
                    type: log.enrollment_type,
                    course: log.course_name,
                    days: {}
                };
            }
            acc[monthYear][log.sid].days[date.getDate()] = {
                in: log.in_time,
                out: log.out_time,
                hrs: log.total_hours,
                topic: log.topic
            };
            return acc;
        }, {});

        // Create a sheet for each month
        Object.keys(groupedData).forEach(monthYear => {
            const worksheet = workbook.addWorksheet(monthYear);
            
            const columns = [
                { header: 'Sr.No', key: 'srno', width: 6 },
                { header: 'Student Name', key: 'name', width: 25 },
                { header: 'Type', key: 'type', width: 12 },
                { header: 'Course', key: 'course', width: 25 },
            ];
            
            // Add days 1-31 with more width for details
            for (let i = 1; i <= 31; i++) {
                columns.push({ header: i.toString(), key: `day${i}`, width: 18 });
            }
            
            worksheet.columns = columns;

            let srNo = 1;
            Object.values(groupedData[monthYear]).forEach(student => {
                const rowData = {
                    srno: srNo++,
                    name: student.name,
                    type: student.type,
                    course: student.course || 'N/A'
                };
                for (let i = 1; i <= 31; i++) {
                    const d = student.days[i];
                    if (d) {
                        // Matching the UI format: In, Out, Hrs on separate lines, then Topic
                        rowData[`day${i}`] = `I: ${d.in}\nO: ${d.out}\nHrs: ${d.hrs}\n${d.topic || ''}`;
                    } else {
                        rowData[`day${i}`] = '-';
                    }
                }
                const row = worksheet.addRow(rowData);
                row.height = 65; // Adjust height for multi-line content
                row.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
                
                // Styling specific alignment for name/course
                row.getCell('name').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                row.getCell('course').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
            });

            // Header Styling
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F46E5' } // Indigo color to match UI
            };
            headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
            headerRow.height = 25;

            // Border styling for all cells
            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Detailed_Student_Attendance.xlsx');
        
        await workbook.xlsx.write(res);
        res.end();
    });
};


// ============================================================
// BACKUP APIs — Yearly Attendance Excel File Management
// ============================================================

// ------------------------------------------------------------
// getBackupYears
// GET /api/admin/attendance/backup/years
//
// Reads the attendance/yearly_exl_file/ directory and returns
// a list of available year folder names (e.g. ['2026', '2025']).
// The frontend uses this to render year accordion cards.
// ------------------------------------------------------------
export const getBackupYears = (req, res) => {

    // Base path where all yearly attendance folders are stored
    const basePath = path.join(process.cwd(), 'attendance', 'yearly_exl_file');

    // If the base folder doesn't exist yet, no attendance has been recorded
    if (!fs.existsSync(basePath)) {
        return res.json({ years: [] });
    }

    // Read all entries in the base folder (both files and directories)
    const entries = fs.readdirSync(basePath, { withFileTypes: true });

    // Filter to directories only — each directory represents one year
    const years = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort((a, b) => b - a); // Descending sort so the latest year appears first

    return res.json({ years });
};


// ------------------------------------------------------------
// getBackupFiles
// GET /api/admin/attendance/backup/files/:year
//
// Returns a list of .xlsx files found inside the specified
// year folder. Each entry includes the filename, size in KB,
// and the last-modified date for display in the frontend table.
// ------------------------------------------------------------
export const getBackupFiles = (req, res) => {

    // Extract the year from the URL parameter
    const { year } = req.params;

    // Validate: only accept 4-digit numeric year values (e.g. 2024, 2025)
    if (!/^\d{4}$/.test(year)) {
        return res.status(400).json({ error: 'Invalid year format.' });
    }

    // Build the full path to the requested year folder
    const yearPath = path.join(process.cwd(), 'attendance', 'yearly_exl_file', year);

    // If the year folder doesn't exist, return an empty list gracefully
    if (!fs.existsSync(yearPath)) {
        return res.json({ files: [] });
    }

    // Read all entries in the year folder
    const entries = fs.readdirSync(yearPath, { withFileTypes: true });

    // Keep only .xlsx files — ignore directories, hidden files, and other formats
    const files = entries
        .filter(entry => entry.isFile() && entry.name.endsWith('.xlsx'))
        .map(entry => {
            // Stat the file to get its size and last-modified timestamp
            const fileStat = fs.statSync(path.join(yearPath, entry.name));
            return {
                name: entry.name,                                    // e.g. "March_2026.xlsx"
                sizeKB: Math.round(fileStat.size / 1024),           // File size in KB
                lastModified: fileStat.mtime.toLocaleDateString('en-IN') // Readable date
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sort by month name

    return res.json({ files });
};


// ------------------------------------------------------------
// downloadBackupFile
// GET /api/admin/attendance/backup/download/:year/:filename
//
// Streams the requested Excel file to the browser as a direct
// download. Both the year and filename are strictly validated
// to prevent path traversal attacks (e.g. "../" in params).
// ------------------------------------------------------------
export const downloadBackupFile = (req, res) => {

    const { year, filename } = req.params;

    // --- Security Validation ---

    // 1. Year must be exactly 4 numeric digits
    if (!/^\d{4}$/.test(year)) {
        return res.status(400).json({ error: 'Invalid year format.' });
    }

    // 2. Filename may only contain alphanumeric characters, underscores,
    //    hyphens, spaces, or dots — prevents path traversal (../ etc.)
    if (!/^[\w\-. ]+\.xlsx$/.test(filename)) {
        return res.status(400).json({ error: 'Invalid filename.' });
    }

    // Resolve the absolute file path safely
    const filePath = path.join(process.cwd(), 'attendance', 'yearly_exl_file', year, filename);

    // Return 404 if the file doesn't exist on disk
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found.' });
    }

    // Stream the file to the browser — Express will set the correct
    // Content-Disposition header to trigger a download dialog
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('File Download Error:', err);
            // Only send an error response if headers have not been sent yet
            if (!res.headersSent) {
                res.status(500).json({ error: 'File download failed.' });
            }
        }
    });
};
