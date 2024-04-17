const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const mysql = require('mysql2');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const db = process.env.DB_DATABASE;

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: db,
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Connected to the database.');
});

const app = express();
const PORT = process.env.PORT;

const routes = require('./routes/router');

app.use(bodyParser.json());
app.use(cors());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
