import Db from '../config/db.js';

// Get the currently allowed location settings
export const getLocationSettings = (req, res) => {
    const sql = "SELECT latitude, longitude, radius FROM location_settings WHERE id = 1";
    Db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error fetching location settings" });
        if (results.length > 0) {
            res.json({
                latitude: results[0].latitude,
                longitude: results[0].longitude,
                radius: results[0].radius
            });
        } else {
            res.json({ latitude: null, longitude: null, radius: 50 });
        }
    });
};

// Update the allowed location settings (Admin)
export const updateLocationSettings = (req, res) => {
    const { latitude, longitude, radius } = req.body;

    const lat = (latitude !== undefined && latitude !== null && latitude !== '') ? parseFloat(latitude) : null;
    const lng = (longitude !== undefined && longitude !== null && longitude !== '') ? parseFloat(longitude) : null;
    // ensure parsing for floats vs nulls
    const r = radius ? parseInt(radius, 10) : 50;

    const sql = "UPDATE location_settings SET latitude = ?, longitude = ?, radius = ? WHERE id = 1";
    Db.query(sql, [lat, lng, r], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error updating location settings" });
        
        // Ensure the row exists just in case it was deleted manually
        if (result.affectedRows === 0) {
            Db.query("INSERT INTO location_settings (id, latitude, longitude, radius) VALUES (1, ?, ?, ?)", [lat, lng, r]);
        }
        res.json({ message: "Location settings updated successfully", latitude: lat, longitude: lng, radius: r });
    });
};
