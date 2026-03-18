import Db from '../config/db.js';

// No complex logic needed as we just manage a single row.
// But we can add a helper to initialize the table here as well
// just like studentModel.js does.

const createIpSettingsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS ip_settings (
            id INT PRIMARY KEY,
            allowed_ip VARCHAR(255) NOT NULL
        )
    `;
    Db.query(query, (err) => {
        if (err) {
            console.error("Error creating ip_settings table: ", err.message);
        } else {
            console.log("ip_settings table ready!");
            // Insert default row if not exists
            Db.query("INSERT IGNORE INTO ip_settings (id, allowed_ip) VALUES (1, '')");
        }
    });
};

export default createIpSettingsTable;
