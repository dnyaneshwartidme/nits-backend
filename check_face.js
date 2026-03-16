import Db from './config/db.js';

const checkStudent = (pin) => {
    const query = "SELECT sid, full_name, face_descriptor FROM student_auth sa JOIN student s ON sa.sid = s.sid WHERE pin = ?";
    Db.query(query, [pin], (err, results) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        if (results.length === 0) {
            console.log("No student found with PIN:", pin);
        } else {
            const student = results[0];
            console.log("Student Name:", student.full_name);
            console.log("Face Descriptor Length:", student.face_descriptor ? JSON.parse(student.face_descriptor).length : "NULL");
            console.log("First 5 values:", student.face_descriptor ? JSON.parse(student.face_descriptor).slice(0, 5) : "NULL");
        }
        process.exit(0);
    });
};

// Check some active students
Db.query("SELECT pin FROM student_auth WHERE status = 'ACTIVE' LIMIT 5", (err, results) => {
    if (results && results.length > 0) {
        results.forEach(r => checkStudent(r.pin));
    } else {
        console.log("No active students found.");
        process.exit(0);
    }
});
