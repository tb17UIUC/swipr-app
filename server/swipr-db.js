require('dotenv').config();
const mysql = require('mysql2/promise');
const { Connector } = require('@google-cloud/cloud-sql-connector');

const connector = new Connector();

let pool = null;

const sqlInit = async () => {
    if (pool) return pool; // Return existing pool if already created

    try {
        const clientOpts = await connector.getOptions({
            instanceConnectionName: process.env.DB_CONNECTION_NAME,
            ipType: 'PUBLIC',
        });

        pool = mysql.createPool({
            ...clientOpts,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        return pool;
    } catch (err) {
        console.log(err);
        throw err; // Rethrow or handle error appropriately
    }
};

module.exports = { sqlInit };
