import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    // Check Authorization header OR token in query params (for downloads)
    const token = req.headers['authorization']?.split(' ')[1] || req.query.token;

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nits_academy_secret_key_2024');
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

export const verifyStudent = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nits_academy_secret_key_2024');
        if (decoded.role !== 'student') {
            return res.status(401).json({ error: "Unauthorized access." });
        }
        req.student = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};
