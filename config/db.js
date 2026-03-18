import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// MySQL connection configuration 
const Db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'nits_academy'
});

// Checking the connection
Db.connect((err) => {
    if (err) {
        console.error('Error connecting to XAMPP MySQL: ' + err.stack);
        return;
    }
    console.log('Successfully connected to XAMPP MySQL database!');
});

export default Db; // Use export default instead of module.exports

// ..................alive live....................

// import mysql from 'mysql2';
// import dotenv from 'dotenv';

// dotenv.config();

// // MySQL connection configuration 
// const Db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 11131, 
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     ssl: {
//         rejectUnauthorized: false 
//     }
// });

// // Checking the connection
// Db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to Aiven MySQL: ' + err.stack);
//         return;
//     }
//     console.log('Successfully connected to Aiven MySQL database!');
// });

// export default Db;