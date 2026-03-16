import Db from '../config/db.js';

// Helper to get table name from type
const getTable = (type) => {
    switch (type) {
        case 'courses': return 'course';
        case 'internships': return 'intern';
        case 'branches': return 'branch_and_degree';
        case 'degrees': return 'branch_and_degree';
        default: return null;
    }
};

// GET: Fetch all items based on type
export const getSettingsItems = (req, res) => {
    const { type } = req.params;
    const table = getTable(type);
    
    if (!table) return res.status(400).json({ error: "Invalid settings type" });

    let sql = `SELECT * FROM ${table}`;
    if (type === 'branches') sql += " WHERE type = 'branch'";
    if (type === 'degrees') sql += " WHERE type = 'degree'";
    sql += " ORDER BY sr_no ASC";

    Db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch settings" });
        res.json(results);
    });
};

// POST: Add new item
export const addSettingsItem = (req, res) => {
    const { type } = req.params;
    const table = getTable(type);
    const data = req.body;

    if (!table) return res.status(400).json({ error: "Invalid settings type" });

    // Find max sr_no
    let maxSrSql = `SELECT MAX(sr_no) as max_sr FROM ${table}`;
    if (type === 'branches') maxSrSql += " WHERE type = 'branch'";
    if (type === 'degrees') maxSrSql += " WHERE type = 'degree'";

    Db.query(maxSrSql, (maxErr, maxRes) => {
        const nextSr = (maxRes[0]?.max_sr || 0) + 1;
        
        let insertSql = "";
        let values = [];

        if (type === 'courses') {
            insertSql = "INSERT INTO course (course_id, course_name, duration, sr_no) VALUES (?, ?, ?, ?)";
            values = [data.course_id, data.course_name, data.duration, nextSr];
        } else if (type === 'internships') {
            insertSql = "INSERT INTO intern (unic_no, duration, sr_no) VALUES (?, ?, ?)";
            values = [data.unic_no, data.duration, nextSr];
        } else if (type === 'branches') {
            insertSql = "INSERT INTO branch_and_degree (type, branch, sr_no) VALUES ('branch', ?, ?)";
            values = [data.branch, nextSr];
        } else if (type === 'degrees') {
            insertSql = "INSERT INTO branch_and_degree (type, degree, sr_no) VALUES ('degree', ?, ?)";
            values = [data.degree, nextSr];
        }

        Db.query(insertSql, values, (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to add item" });
            res.json({ message: "Item added successfully", id: result.insertId });
        });
    });
};

// PUT: Update item
export const updateSettingsItem = (req, res) => {
    const { type, id } = req.params;
    const table = getTable(type);
    const data = req.body;

    if (!table) return res.status(400).json({ error: "Invalid settings type" });

    let updateSql = "";
    let values = [];
    let idCol = (type === 'courses') ? 'cid' : (type === 'internships' ? 'iid' : 'bdi');

    if (type === 'courses') {
        updateSql = "UPDATE course SET course_id=?, course_name=?, duration=? WHERE cid=?";
        values = [data.course_id, data.course_name, data.duration, id];
    } else if (type === 'internships') {
        updateSql = "UPDATE intern SET unic_no=?, duration=? WHERE iid=?";
        values = [data.unic_no, data.duration, id];
    } else if (type === 'branches') {
        updateSql = "UPDATE branch_and_degree SET branch=? WHERE bdi=?";
        values = [data.branch, id];
    } else if (type === 'degrees') {
        updateSql = "UPDATE branch_and_degree SET degree=? WHERE bdi=?";
        values = [data.degree, id];
    }

    Db.query(updateSql, values, (err) => {
        if (err) return res.status(500).json({ error: "Failed to update item" });
        res.json({ message: "Item updated successfully" });
    });
};

// DELETE: Delete item
export const deleteSettingsItem = (req, res) => {
    const { type, id } = req.params;
    const table = getTable(type);
    let idCol = (type === 'courses') ? 'cid' : (type === 'internships' ? 'iid' : 'bdi');

    if (!table) return res.status(400).json({ error: "Invalid settings type" });

    Db.query(`DELETE FROM ${table} WHERE ${idCol} = ?`, [id], (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete item" });
        res.json({ message: "Item deleted successfully" });
    });
};

// POST: Reorder items (Sr No update)
export const reorderSettingsItems = (req, res) => {
    const { type } = req.params;
    const { items } = req.body; // Array of ids in new order
    const table = getTable(type);
    let idCol = (type === 'courses') ? 'cid' : (type === 'internships' ? 'iid' : 'bdi');

    if (!table || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid request data" });
    }

    // Execute multiple updates in sequence or parallel
    const promises = items.map((id, index) => {
        return new Promise((resolve, reject) => {
            const sr_no = index + 1;
            Db.query(`UPDATE ${table} SET sr_no = ? WHERE ${idCol} = ?`, [sr_no, id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    Promise.all(promises)
        .then(() => res.json({ message: "Reordered successfully" }))
        .catch(err => {
            console.error("Reorder error:", err);
            res.status(500).json({ error: "Failed to update order" });
        });
};
