import Db from './config/db.js';

Db.query("SELECT * FROM admin_users", (err, results) => {
    if (err) {
        console.error("Error query:", err);
    } else {
        console.log("Admin Users:", results);
    }
    process.exit();
});
