import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Omkar@1512',
    database: process.env.DB_NAME || 'nits_academy'
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting:", err);
        process.exit(1);
    }
    console.log("Connected to DB.");

    const sql = `
        ALTER TABLE subjects 
        ADD COLUMN question_limit INT DEFAULT 50,
        ADD COLUMN time_per_question DECIMAL(4,2) DEFAULT 1.50
    `;

    db.query(sql, (error, results) => {
        if (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log("Columns already exist.");
            } else {
                console.error("Error altering table:", error);
            }
        } else {
            console.log("Columns added successfully.");
        }
        process.exit(0);
    });
});
