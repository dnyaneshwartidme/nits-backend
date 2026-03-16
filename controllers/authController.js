import Db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const adminLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const sql = "SELECT * FROM admin_users WHERE username = ?";
    Db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.aid, username: user.username },
            process.env.JWT_SECRET || 'nits_academy_secret_key_2024',
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.aid, username: user.username }
        });
    });
};

export const changePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin?.id; // From verifyAdmin middleware (req.admin)

    if (!adminId) {
        return res.status(403).json({ error: "Unauthorized: Invalid admin session." });
    }

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new passwords are required" });
    }

    // 1. Fetch admin from DB
    const sql = "SELECT * FROM admin_users WHERE aid = ?";
    Db.query(sql, [adminId], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Admin not found" });

        const user = results[0];

        // 2. Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // 3. Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Update password in DB
        const updateSql = "UPDATE admin_users SET password = ? WHERE aid = ?";
        Db.query(updateSql, [hashedPassword, adminId], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: "Failed to update password" });
            res.json({ message: "Password updated successfully!" });
        });
    });
};
