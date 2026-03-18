import db from '../config/db.js';

// Create the email_settings table if it doesn't exist
const createEmailSettingsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS email_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            smtp_email VARCHAR(255) DEFAULT '',
            smtp_password VARCHAR(255) DEFAULT ''
        )
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error creating email_settings table:', err);
            return;
        }
        console.log('email_settings table is ready.');

        // Initialize with a default row if the table is empty
        const checkQuery = 'SELECT COUNT(*) AS count FROM email_settings';
        db.query(checkQuery, (err, rows) => {
            if (err) {
                console.error('Error checking email_settings table:', err);
                return;
            }
            if (rows[0].count === 0) {
                const insertQuery = "INSERT INTO email_settings (id, smtp_email, smtp_password) VALUES (1, '', '')";
                db.query(insertQuery, (err, insertResult) => {
                    if (err) {
                        console.error('Error inserting default email settings:', err);
                    } else {
                        console.log('Inserted default email settings.');
                    }
                });
            }
        });
    });
};

export default createEmailSettingsTable;
