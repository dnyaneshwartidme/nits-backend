import Db from '../config/db.js';
import bcrypt from 'bcryptjs';

const createTables = () => {

    // 1️⃣ Course Table
    const courseSql = `
        CREATE TABLE IF NOT EXISTS course (
            cid INT AUTO_INCREMENT PRIMARY KEY,
            course_id VARCHAR(100) UNIQUE NOT NULL,
            course_name VARCHAR(255) NOT NULL,
            duration VARCHAR(100),
            sr_no INT
        )
    `;

    // 2️⃣ Student Table
    const studentSql = `
        CREATE TABLE IF NOT EXISTS student (
            sid INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(50),
            address TEXT,
            college_name VARCHAR(255),
            branch VARCHAR(100),
            collage_course VARCHAR(255),
            year VARCHAR(100),
            user_img VARCHAR(255),
            resume VARCHAR(255),
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // 3️⃣ Intern Table
    const internSql = `
        CREATE TABLE IF NOT EXISTS intern (
            iid INT AUTO_INCREMENT PRIMARY KEY,
            unic_no VARCHAR(100) UNIQUE NOT NULL,
            duration VARCHAR(100),
            sr_no INT
        )
    `;

    // 4️⃣ Enrollment Table
    const enrollmentSql = `
        CREATE TABLE IF NOT EXISTS enrollment (
            eid INT AUTO_INCREMENT PRIMARY KEY,
            sid INT,
            cid INT,
            iid INT,
            type VARCHAR(50) DEFAULT 'course',
            status VARCHAR(100) DEFAULT 'active',
            enrollment_date DATE,
            certificate_no VARCHAR(255),
            exal_file VARCHAR(255),

            FOREIGN KEY (sid) REFERENCES student(sid) ON DELETE CASCADE,
            FOREIGN KEY (cid) REFERENCES course(cid) ON DELETE SET NULL,
            FOREIGN KEY (iid) REFERENCES intern(iid) ON DELETE SET NULL
        )
    `;

    // 5️⃣ Student Auth Table (Face + PIN)
    const studentAuthSql = `
        CREATE TABLE IF NOT EXISTS student_auth (
            said INT AUTO_INCREMENT PRIMARY KEY,
            sid INT,
            face_descriptor LONGTEXT,
            pin INT UNIQUE,
            status VARCHAR(100) DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (sid) REFERENCES student(sid) ON DELETE CASCADE
        )
    `;

    // 6️⃣ Branch and Degree Table
    const bdiSql = `
        CREATE TABLE IF NOT EXISTS branch_and_degree (
            bdi INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(100),
            branch VARCHAR(100),
            degree VARCHAR(100),
            sr_no INT
        )
    `;

    // 7️⃣ Attendance Log Table
    const attendanceLogSql = `
        CREATE TABLE IF NOT EXISTS attendance_log (
            log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
            sid INT NOT NULL,
            attendance_date DATE NOT NULL,
            in_time VARCHAR(20),
            out_time VARCHAR(20),
            total_hours VARCHAR(10),
            topic TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (sid) REFERENCES student(sid) ON DELETE CASCADE,
            UNIQUE KEY unique_attendance (sid, attendance_date)
        )
    `;

    // 8️⃣ Admin Users Table
    const adminUserSql = `
        CREATE TABLE IF NOT EXISTS admin_users (
            aid INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // 9️⃣ Subjects Table (Exam Feature)
    const subjectSql = `
        CREATE TABLE IF NOT EXISTS subjects (
            subject_id INT AUTO_INCREMENT PRIMARY KEY,
            subject_name VARCHAR(255) UNIQUE NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            question_limit INT DEFAULT 50,
            time_per_question DECIMAL(4,2) DEFAULT 1.50,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // 🔟 Exam Questions Table
    const examQuestionSql = `
        CREATE TABLE IF NOT EXISTS exam_questions (
            qid INT AUTO_INCREMENT PRIMARY KEY,
            subject_id INT NOT NULL,
            question_text TEXT NOT NULL,
            option_a VARCHAR(255) NOT NULL,
            option_b VARCHAR(255) NOT NULL,
            option_c VARCHAR(255) NOT NULL,
            option_d VARCHAR(255) NOT NULL,
            correct_option ENUM('A', 'B', 'C', 'D') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
        )
    `;

    // 1️⃣1️⃣ Exam Results Table
    const examResultSql = `
        CREATE TABLE IF NOT EXISTS exam_results (
            result_id INT AUTO_INCREMENT PRIMARY KEY,
            sid INT NOT NULL,
            subject_id INT NOT NULL,
            total_questions INT NOT NULL,
            correct_answers INT NOT NULL,
            score_percentage DECIMAL(5,2) NOT NULL,
            exam_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (sid) REFERENCES student(sid) ON DELETE CASCADE,
            FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
        )
    `;

    const tables = [
        { name: 'Course', sql: courseSql },
        { name: 'Student', sql: studentSql },
        { name: 'Intern', sql: internSql },
        { name: 'Enrollment', sql: enrollmentSql },
        { name: 'StudentAuth', sql: studentAuthSql },
        { name: 'BranchAndDegree', sql: bdiSql },
        { name: 'AttendanceLog', sql: attendanceLogSql },
        { name: 'AdminUsers', sql: adminUserSql },
        { name: 'Subjects', sql: subjectSql },
        { name: 'ExamQuestions', sql: examQuestionSql },
        { name: 'ExamResults', sql: examResultSql }
    ];

    // Ensure status column exists in enrollment (if table already existed)
    const alterEnrollmentSql = `ALTER TABLE enrollment ADD COLUMN IF NOT EXISTS status VARCHAR(100) DEFAULT 'active' AFTER type`;
    Db.query(alterEnrollmentSql, (err) => {
        if (err) console.log("Note: ALTER TABLE enrollment (status) might have failed if already exists or not supported, skipping.");
    });

    // Ensure status column in student_auth is VARCHAR(100) to support 'COMPLETED' status
    const alterStudentAuthSql = `ALTER TABLE student_auth MODIFY COLUMN status VARCHAR(100) DEFAULT 'PENDING'`;
    Db.query(alterStudentAuthSql, (err) => {
        if (err) console.log("Note: ALTER TABLE student_auth MODIFY COLUMN status failed.");
    });


    tables.forEach(table => {
        Db.query(table.sql, (err) => {
            if (err) console.error(`❌ Error creating ${table.name}:`, err);
            else console.log(`✅ ${table.name} Table Ready`);
        });
    });

    // Indexes (Performance)
    const indexQueries = [

        `CREATE INDEX idx_student_email ON student(email)`,
        `CREATE INDEX idx_attendance_sid ON attendance_log(sid)`,
        `CREATE INDEX idx_attendance_date ON attendance_log(attendance_date)`,
        `CREATE INDEX idx_sid_date ON attendance_log(sid, attendance_date)`

    ];

    indexQueries.forEach(query => {
        Db.query(query, () => {});
    });

    // Dummy Data
    setTimeout(() => {

        const dummyCourseData = `
        INSERT IGNORE INTO course (cid, course_id, course_name, duration, sr_no) VALUES
        (1,'CS101','Full Stack MERN','6 Months',1),
        (2,'DA102','Data Analytics','4 Months',2),
        (3,'AI103','Machine Learning','8 Months',3)
        `;

        const dummyInternData = `
        INSERT IGNORE INTO intern (iid, unic_no, duration, sr_no) VALUES
        (1,'INT-45','45 Days',1),
        (2,'INT-90','3 Months',2),
        (3,'INT-180','6 Months',3)
        `;

        const dummyBdiData = `
        INSERT IGNORE INTO branch_and_degree (bdi,type,branch,degree,sr_no) VALUES
        (1,'degree',NULL,'B.E',1),
        (2,'degree',NULL,'B.Tech',2),
        (3,'degree',NULL,'M.E',3),
        (4,'branch','Computer Science',NULL,1),
        (5,'branch','Mechanical',NULL,2),
        (6,'branch','Civil Engineering',NULL,3)
        `;

        Db.query(dummyCourseData);
        Db.query(dummyInternData);
        Db.query(dummyBdiData);

        // Add Default Admin User: admin / 1234
        const adminPassword = '1234';
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(adminPassword, salt);
        
        const dummyAdminSql = `
            INSERT INTO admin_users (username, password) 
            VALUES ('admin', ?) 
            ON DUPLICATE KEY UPDATE password = ?
        `;
        
        Db.query(dummyAdminSql, [hashedPassword, hashedPassword], (err) => {
            if (err) console.error("❌ Admin User Ready Error:", err);
            else console.log("👤 Admin User Ready ('admin' / '1234')");
        });

        // Add Dummy Subjects and Questions
        const dummySubjectsSql = `
            INSERT IGNORE INTO subjects (subject_id, subject_name, is_active) VALUES
            (1, 'ReactJS Basics', 1),
            (2, 'HTML & CSS', 1)
        `;
        
        const dummyQuestionsSql = `
            INSERT IGNORE INTO exam_questions (qid, subject_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES
            (1, 1, 'What is React?', 'A UI library', 'A database', 'An OS', 'A browser', 'A'),
            (2, 1, 'Which concept is NOT part of React?', 'Components', 'States', 'Props', 'Tables', 'D'),
            (3, 1, 'What is JSX?', 'JavaScript XML', 'Java Syntax Extension', 'JSON X', 'JavaScript X-Factor', 'A'),
            (4, 2, 'What does HTML stand for?', 'Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language', 'Hex Text Markup Language', 'A'),
            (5, 2, 'Which HTML tag is used to define an internal style sheet?', '<script>', '<css>', '<style>', '<design>', 'C')
        `;

        Db.query(dummySubjectsSql, (err) => {
            if (err) console.error("❌ Error adding dummy subjects:", err);
            else {
                console.log("📚 Dummy Subjects Added");
                // Run ALTER TABLE just in case it already exists without the new columns
                const alterSubjectsSql = `
                    ALTER TABLE subjects 
                    ADD COLUMN IF NOT EXISTS question_limit INT DEFAULT 50,
                    ADD COLUMN IF NOT EXISTS time_per_question DECIMAL(4,2) DEFAULT 1.50
                `;
                Db.query(alterSubjectsSql, (alterErr) => {
                    if (alterErr && alterErr.code !== 'ER_DUP_FIELDNAME') {
                        console.error("❌ Error altering subjects table:", alterErr);
                    } else if (!alterErr) {
                        console.log("🔨 Subjects Table column updated with limits.");
                    }
                });
                Db.query(dummyQuestionsSql, (err) => {
                    if (err) console.error("❌ Error adding dummy questions:", err);
                    else console.log("❓ Dummy Questions Added");
                });
            }
        });

        console.log("🌱 Dummy data inserted");

    },2000);

};

export default createTables;