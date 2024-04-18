const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const mysql = require('mysql2/promise');
const { Connector } = require('@google-cloud/cloud-sql-connector');
const { GoogleAuth } = require('google-auth-library');

const connector = new Connector();

const projectId = process.env.DB_PROCESS_ID;

const testFunc = async () => {
    const clientOpts = await connector.getOptions({
        instanceConnectionName: process.env.DB_CONNECTION_NAME,
        ipType: 'PUBLIC',
    });

    const pool = await mysql.createPool({
        ...clientOpts,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const conn = await pool.getConnection();
    const [rows] = await conn.query(
        'SELECT c.Clothing_Id FROM Clothes c LIMIT 15'
    );
    console.table(rows);
    await pool.end(); // Close the pool to release resources
    connector.close();
};

// console.log(rows);

// const host = process.env.DB_HOST;
// const socket_path = process.env.DB_SOCKET_PATH;
// const user = process.env.DB_USER;
// const password = process.env.DB_PASSWORD;
// const db = process.env.DB_DATABASE;

// const connection = mysql.createConnection({
//     // host: host,
//     socketPath: socket_path,
//     user: user,
//     password: password,
//     database: db,
// });

// connection.connect((error) => {
//     if (error) {
//         console.error('Error connecting to the database:', error);
//         return;
//     }
//     console.log('Connected to the database.');
// });

const app = express();
const PORT = process.env.PORT;

const routes = require('./routes/router');

app.use(bodyParser.json());
app.use(cors());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const testfunc = async () => {
//     const clientOpts = await connector.getOptions({
//         instanceConnectionName: 'swipr-415103:us-central1:swipr-sql',
//         ipType: 'PUBLIC',
//     });
//     const pool = await mysql.createPool({
//         ...clientOpts,
//         user: 'main',
//         password: 'Swipr123&',
//         database: 'swipr-db',
//     });

//     try {
//         const conn = await pool.getConnection();
//         const [rows] = await conn.query(
//             'SELECT c.Clothing_Id FROM Clothes c LIMIT 15'
//         );
//         console.table(rows); // Print all rows from the 'clothes' table
//     } catch (err) {
//         console.error('Error querying database:', err);
//     } finally {
//         await pool.end(); // Close the pool to release resources
//         connector.close(); // Close the Cloud SQL Connector
//     }
// };

testFunc();
