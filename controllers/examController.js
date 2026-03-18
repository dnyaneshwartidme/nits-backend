import Db from '../config/db.js';

// ==========================================
// ADMIN EXAM APIs
// ==========================================

// 1. Add Subject
export const addSubject = async (req, res) => {
    const { subject_name, question_limit = 50, time_per_question = 1.50 } = req.body;
    if (!subject_name) return res.status(400).json({ error: "Subject name is required." });

    try {
        const sql = "INSERT INTO subjects (subject_name, question_limit, time_per_question) VALUES (?, ?, ?)";
        const [result] = await Db.promise().query(sql, [subject_name, question_limit, time_per_question]);
        res.json({ message: "Subject added successfully!", subject_id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Subject already exists." });
        }
        console.error("Add Subject Error:", err);
        res.status(500).json({ error: "Failed to add subject." });
    }
};

// 1.5 Update Subject Limits
export const updateSubjectLimits = async (req, res) => {
    const { id } = req.params;
    const { question_limit, time_per_question } = req.body;
    try {
        const sql = "UPDATE subjects SET question_limit = ?, time_per_question = ? WHERE subject_id = ?";
        const [result] = await Db.promise().query(sql, [question_limit, time_per_question, id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Subject not found." });
        res.json({ message: "Subject limits updated successfully!" });
    } catch (err) {
        console.error("Update Limits Error:", err);
        res.status(500).json({ error: "Failed to update subject limits." });
    }
};

// 2. Get All Subjects (Admin)
export const getSubjects = async (req, res) => {
    try {
        const sql = "SELECT * FROM subjects ORDER BY created_at DESC";
        const [results] = await Db.promise().query(sql);
        res.json(results);
    } catch (err) {
        console.error("Get Subjects Error:", err);
        res.status(500).json({ error: "Failed to fetch subjects." });
    }
};

// 3. Toggle Subject Status
export const toggleSubjectStatus = async (req, res) => {
    const { id } = req.params;
    try {
        // Toggle the current `is_active` state
        const sql = "UPDATE subjects SET is_active = NOT is_active WHERE subject_id = ?";
        const [result] = await Db.promise().query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Subject not found." });
        }
        res.json({ message: "Subject status updated successfully!" });
    } catch (err) {
        console.error("Toggle Subject Error:", err);
        res.status(500).json({ error: "Failed to toggle subject status." });
    }
};

// 4. Add Question
export const addQuestion = async (req, res) => {
    const { subject_id, question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;

    if (!subject_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const sql = `
            INSERT INTO exam_questions 
            (subject_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [subject_id, question_text, option_a, option_b, option_c, option_d, correct_option];
        await Db.promise().query(sql, values);
        res.json({ message: "Question added successfully!" });
    } catch (err) {
        console.error("Add Question Error:", err);
        res.status(500).json({ error: "Failed to add question." });
    }
};

// 5. Get All Questions
export const getQuestions = async (req, res) => {
    const { subject_id } = req.query;
    try {
        let sql = `
            SELECT eq.*, s.subject_name 
            FROM exam_questions eq
            JOIN subjects s ON eq.subject_id = s.subject_id
        `;
        const queryParams = [];

        if (subject_id) {
            sql += " WHERE eq.subject_id = ?";
            queryParams.push(subject_id);
        }
        sql += " ORDER BY eq.created_at DESC";

        const [results] = await Db.promise().query(sql, queryParams);
        res.json(results);
    } catch (err) {
        console.error("Get Questions Error:", err);
        res.status(500).json({ error: "Failed to fetch questions." });
    }
};

// 6. Update a Question
export const updateQuestion = async (req, res) => {
    const qid = req.params.id;
    const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;

    if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const sql = `
            UPDATE exam_questions 
            SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?
            WHERE qid = ?
        `;
        const values = [question_text, option_a, option_b, option_c, option_d, correct_option, qid];

        const [result] = await Db.promise().query(sql, values);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Question not found" });
        }
        res.json({ message: "Question updated successfully" });
    } catch (error) {
        console.error("Update Question Error:", error);
        res.status(500).json({ error: "Failed to update question." });
    }
};

// 7. Delete Question
export const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = "DELETE FROM exam_questions WHERE qid = ?";
        const [result] = await Db.promise().query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Question not found." });
        }
        res.json({ message: "Question deleted successfully!" });
    } catch (err) {
        console.error("Delete Question Error:", err);
        res.status(500).json({ error: "Failed to delete question." });
    }
};

// ==========================================
// ADMIN EXAM RESULTS APIs
// ==========================================

// 7a. Get all subjects with attempt count (Admin)
export const getAdminSubjectStats = async (req, res) => {
    try {
        const sql = `
            SELECT s.subject_id, s.subject_name, s.is_active, 
                   COUNT(er.result_id) AS total_attempts
            FROM subjects s
            LEFT JOIN exam_results er ON s.subject_id = er.subject_id
            GROUP BY s.subject_id
            ORDER BY s.subject_name ASC
        `;
        const [results] = await Db.promise().query(sql);
        res.json(results);
    } catch (err) {
        console.error("Get Admin Subject Stats Error:", err);
        res.status(500).json({ error: "Failed to fetch subject stats." });
    }
};

// 7b. Get all exam results for a specific subject (Admin)
export const getAdminSubjectResults = async (req, res) => {
    const { subjectId } = req.params;
    try {
        const sql = `
            SELECT er.result_id, er.exam_date, er.total_questions, er.correct_answers, er.score_percentage,
                   st.full_name AS student_name, st.email AS student_email,
                   s.subject_name
            FROM exam_results er
            JOIN student st ON er.sid = st.sid
            JOIN subjects s ON er.subject_id = s.subject_id
            WHERE er.subject_id = ?
            ORDER BY er.exam_date DESC
        `;
        const [results] = await Db.promise().query(sql, [subjectId]);
        res.json(results);
    } catch (err) {
        console.error("Get Admin Subject Results Error:", err);
        res.status(500).json({ error: "Failed to fetch results." });
    }
};

// 7c. Delete an exam result (Admin)
export const deleteExamResult = async (req, res) => {
    const { resultId } = req.params;
    try {
        const sql = "DELETE FROM exam_results WHERE result_id = ?";
        const [result] = await Db.promise().query(sql, [resultId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Result not found." });
        }
        res.json({ message: "Result deleted successfully!" });
    } catch (err) {
        console.error("Delete Exam Result Error:", err);
        res.status(500).json({ error: "Failed to delete result." });
    }
};

// 7d. Get all exam results for a specific student by sid (Admin)
export const getStudentExamResults = async (req, res) => {
    const { sid } = req.params;
    try {
        const sql = `
            SELECT er.result_id, er.exam_date, er.total_questions, er.correct_answers, er.score_percentage,
                   s.subject_name
            FROM exam_results er
            JOIN subjects s ON er.subject_id = s.subject_id
            WHERE er.sid = ?
            ORDER BY er.exam_date DESC
        `;
        const [results] = await Db.promise().query(sql, [sid]);
        res.json(results);
    } catch (err) {
        console.error("Get Student Exam Results Error:", err);
        res.status(500).json({ error: "Failed to fetch student exam results." });
    }
};

// ==========================================
// STUDENT EXAM APIs
// ==========================================

// 7. Get Available Exam Subjects (Student)
export const getStudentSubjects = async (req, res) => {
    try {
        // Only return active subjects that actually have questions
        const sql = `
            SELECT DISTINCT s.subject_id, s.subject_name 
            FROM subjects s
            JOIN exam_questions eq ON s.subject_id = eq.subject_id
            WHERE s.is_active = TRUE
        `;
        const [results] = await Db.promise().query(sql);
        res.json(results);
    } catch (err) {
        console.error("Get Student Subjects Error:", err);
        res.status(500).json({ error: "Failed to fetch active subjects." });
    }
};

// 8. Get Questions for a Subject (without correct option)
export const getStudentQuestions = async (req, res) => {
    const { subjectId } = req.params;
    try {
        // Verify subject is active and fetch limits
        const checkSql = "SELECT is_active, question_limit, time_per_question FROM subjects WHERE subject_id = ?";
        const [checkRes] = await Db.promise().query(checkSql, [subjectId]);
        
        if (checkRes.length === 0 || !checkRes[0].is_active) {
            return res.status(403).json({ error: "This exam is currently not active." });
        }

        const { question_limit, time_per_question } = checkRes[0];

        const sql = `
            SELECT qid, subject_id, question_text, option_a, option_b, option_c, option_d 
            FROM exam_questions 
            WHERE subject_id = ?
            ORDER BY RAND() 
            LIMIT ?
        `;
        // Convert to Number to satisfy strict SQL modes for LIMIT
        const [results] = await Db.promise().query(sql, [subjectId, Number(question_limit)]);
        
        res.json({
            questions: results,
            time_per_question: parseFloat(time_per_question) || 1.50
        });
    } catch (err) {
        console.error("Get Student Questions Error:", err);
        res.status(500).json({ error: "Failed to fetch exam questions." });
    }
};

// 9. Submit Exam
export const submitExam = async (req, res) => {
    const { subject_id, studentAnswers } = req.body;
    const student_id = req.student.sid; // From verifyStudent middleware (JWT payload)

    if (!studentAnswers || !Array.isArray(studentAnswers)) {
        return res.status(400).json({ error: "Invalid answers submitted." });
    }

    try {
        // Fetch correct answers
        const qSql = "SELECT qid, correct_option FROM exam_questions WHERE subject_id = ?";
        const [questions] = await Db.promise().query(qSql, [subject_id]);
        
        if (questions.length === 0) {
            return res.status(404).json({ error: "No questions found for this subject." });
        }

        // Calculate score
        let correctAnswers = 0;
        const totalQuestions = studentAnswers.length;

        // Map correct answers for quick lookup
        const answersMap = {};
        questions.forEach(q => { answersMap[q.qid] = q.correct_option; });

        studentAnswers.forEach(ans => {
            if (answersMap[ans.qid] && answersMap[ans.qid] === ans.selected_option) {
                correctAnswers++;
            }
        });

        const scorePercentage = (correctAnswers / totalQuestions) * 100;

        // Save result
        const insertSql = `
            INSERT INTO exam_results (sid, subject_id, total_questions, correct_answers, score_percentage)
            VALUES (?, ?, ?, ?, ?)
        `;
        await Db.promise().query(insertSql, [student_id, subject_id, totalQuestions, correctAnswers, scorePercentage]);

        res.json({
            message: "Exam submitted successfully!",
            total_questions: totalQuestions,
            correct_answers: correctAnswers,
            score_percentage: scorePercentage.toFixed(2)
        });

    } catch (err) {
        console.error("Submit Exam Error:", err);
        res.status(500).json({ error: "Failed to submit exam." });
    }
};

// 10. Get My Results
export const getMyResults = async (req, res) => {
    const student_id = req.student.sid;
    try {
        const sql = `
            SELECT er.*, s.subject_name 
            FROM exam_results er
            JOIN subjects s ON er.subject_id = s.subject_id
            WHERE er.sid = ?
            ORDER BY er.exam_date DESC
        `;
        const [results] = await Db.promise().query(sql, [student_id]);
        res.json(results);
    } catch (err) {
        console.error("Get My Results Error:", err);
        res.status(500).json({ error: "Failed to fetch your results." });
    }
};
