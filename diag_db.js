import Db from './config/db.js';

const checkDb = async () => {
    try {
        const [logs] = await Db.promise().query("SELECT COUNT(*) as count FROM attendance_log");
        const [students] = await Db.promise().query("SELECT COUNT(*) as count FROM student");
        const [enrollment] = await Db.promise().query("SELECT COUNT(*) as count FROM enrollment");
        
        console.log("--- DB STATS ---");
        console.log("Attendance Logs:", logs[0].count);
        console.log("Total Students:", students[0].count);
        console.log("Total Enrollments:", enrollment[0].count);

        const [mismatch] = await Db.promise().query(`
            SELECT al.sid FROM attendance_log al
            LEFT JOIN enrollment e ON al.sid = e.sid
            WHERE e.sid IS NULL
        `);
        
        if (mismatch.length > 0) {
            console.log("⚠️ WARNING: Found attendance logs for students WITHOUT enrollment records:", mismatch.map(m => m.sid));
        } else {
            console.log("✅ All students with attendance have enrollment records.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Diagnostic error:", err);
        process.exit(1);
    }
};

checkDb();
