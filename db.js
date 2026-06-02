// Load the secret values from .env file
require('dotenv').config();

// Import the mysql2 package we installed
const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,         // "localhost"
  user: process.env.DB_USER,         // "root"
  password: process.env.DB_PASSWORD, // ""
  database: process.env.DB_NAME      // "pharmacy"
});

// Try to connect and check if it worked
db.connect(function(err) {
  if (err) {
    console.log('Database connection FAILED:', err);
  } else {
    console.log('Database connected successfully! ✅');
  }
});

// Make this connection available to other files
module.exports = db;