import Db from '../config/db.js';

// Get the currently allowed IP
export const getAllowedIp = (req, res) => {
    const sql = "SELECT allowed_ip FROM ip_settings WHERE id = 1";
    Db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error fetching IP settings" });
        if (results.length > 0) {
            res.json({ allowed_ip: results[0].allowed_ip });
        } else {
            res.json({ allowed_ip: "" });
        }
    });
};

// Update the allowed IP (Admin only usually)
export const updateAllowedIp = (req, res) => {
    const { allowed_ip } = req.body;
    if (typeof allowed_ip !== 'string') {
        return res.status(400).json({ error: "Invalid IP address provided" });
    }

    const sql = "UPDATE ip_settings SET allowed_ip = ? WHERE id = 1";
    Db.query(sql, [allowed_ip.trim()], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error updating IP settings" });
        
        // Ensure the row exists just in case it was deleted manually
        if (result.affectedRows === 0) {
            Db.query("INSERT INTO ip_settings (id, allowed_ip) VALUES (1, ?)", [allowed_ip.trim()]);
        }
        res.json({ message: "Allowed IP updated successfully", allowed_ip: allowed_ip.trim() });
    });
};

// Help the frontend find its own external/public IP as viewed by the Node server
export const getMyIp = (req, res) => {
    // req.ip can often be IPv6 locally like ::1, or IPv4-mapped like ::ffff:192.168.1.100
    // Try to extract pure IPv4 or standard IP.
    let clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.connection?.remoteAddress || req.ip || '';
    
    if (typeof clientIp === 'string') {
        // x-forwarded-for can be a comma separated list, take the first one
        if (clientIp.includes(',')) {
            clientIp = clientIp.split(',')[0].trim();
        }
        
        // Clean up IPv4 mapped addresses natively tracked by node like "::ffff:192.168.1.10"
        if (clientIp.startsWith("::ffff:")) {
            clientIp = clientIp.substring(7);
        }
        
        // Convert IPv6 loopback to IPv4 loopback for better clarity
        if (clientIp === '::1') {
            clientIp = '127.0.0.1';
        }
    } else {
        clientIp = '';
    }

    res.json({ ip: clientIp });
};
