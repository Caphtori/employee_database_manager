require('dotenv').config();
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'employees_db'
    },
    console.log(`Successfully connected to the employees_db database.`)
);