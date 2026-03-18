import Db from '../config/db.js';

const createLocationSettingsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS location_settings (
            id INT PRIMARY KEY,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            radius INT DEFAULT 50
        )
    `;
    Db.query(query, (err) => {
        if (err) {
            console.error("Error creating location_settings table: ", err.message);
        } else {
            console.log("location_settings table ready!");
            // Insert default row if not exists
            Db.query("INSERT IGNORE INTO location_settings (id, latitude, longitude, radius) VALUES (1, NULL, NULL, 50)");
        }
    });
};

export default createLocationSettingsTable;
