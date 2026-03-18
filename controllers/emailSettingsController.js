import db from '../config/db.js';

// Get current email settings
export const getEmailSettings = (req, res) => {
    const query = 'SELECT smtp_email, smtp_password FROM email_settings WHERE id = 1';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching email settings:', err);
            return res.status(500).json({ error: 'Database error fetching email settings' });
        }
        
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({ smtp_email: '', smtp_password: '' });
        }
    });
};

// Update email settings
export const updateEmailSettings = (req, res) => {
    const { smtp_email, smtp_password } = req.body;

    const query = 'UPDATE email_settings SET smtp_email = ?, smtp_password = ? WHERE id = 1';
    db.query(query, [smtp_email || '', smtp_password || ''], (err, result) => {
        if (err) {
            console.error('Error updating email settings:', err);
            return res.status(500).json({ error: 'Failed to update email settings', details: err.message });
        }
        res.json({ message: 'Email settings saved successfully!' });
    });
};
