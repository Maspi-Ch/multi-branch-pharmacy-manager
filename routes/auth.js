// Import express
const express = require('express');

// A "router" is like a mini server that handles specific routes
const router = express.Router();

// Import bcrypt - used to check passwords
const bcrypt = require('bcrypt');

// Import our database connection from db.js
const db = require('../db');

// This is our LOGIN route
// It activates when someone sends a POST request to /api/login
router.post('/login', function(req, res) {

  // Step 1: Get the email, password and role from the login form
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  // Step 2: Decide which table to search in
  // If role is "admin" → search Admins table
  // If role is "staff" → search Staff table
  let table = '';
  if (role === 'admin') {
    table = 'Admins';
  } else {
    table = 'Staff';
  }

  // Step 3: Search the database for this email
  const query = 'SELECT * FROM ' + table + ' WHERE Email = ?';

  db.query(query, [email], function(err, results) {

    // If something went wrong with the database
    if (err) {
      return res.json({ success: false, message: 'Database error.' });
    }

    // If no user was found with that email
    if (results.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password.' });
    }

    // Step 4: A user was found, now check the password
    const user = results[0];

    bcrypt.compare(password, user.Password, function(err, match) {

      // If passwords do NOT match
      if (!match) {
        return res.json({ success: false, message: 'Invalid email or password.' });
      }

      // Step 5: Everything is correct! Send back success
      res.json({
        success: true,
        message: 'Login successful!',
        role: role,
        name: user.Name
      });

    });

  });

});
// This route fetches real stats from the database for the dashboard
router.get('/dashboard-stats', function(req, res) {

  // We will run multiple COUNT queries at once
  const queries = [
    'SELECT COUNT(*) AS total FROM Medicines',
    'SELECT COUNT(*) AS total FROM ExpiryAlerts',
    'SELECT COUNT(*) AS total FROM Batches',
    'SELECT COUNT(*) AS total FROM Branches',
    'SELECT COUNT(*) AS total FROM Sales',
    'SELECT COUNT(*) AS total FROM Suppliers',
    // Low stock means quantity is less than 10
    'SELECT COUNT(*) AS total FROM Batches WHERE Quantity < 10'
  ];

  // We will store results here
  const results = {};

  // Run first query - Medicines
  db.query(queries[0], function(err, rows) {
    results.medicines = rows[0].total;

    // Run second query - Expiry Alerts
    db.query(queries[1], function(err, rows) {
      results.expiryAlerts = rows[0].total;

      // Run third query - Batches
      db.query(queries[2], function(err, rows) {
        results.batches = rows[0].total;

        // Run fourth query - Branches
        db.query(queries[3], function(err, rows) {
          results.branches = rows[0].total;

          // Run fifth query - Sales
          db.query(queries[4], function(err, rows) {
            results.sales = rows[0].total;

            // Run sixth query - Suppliers
            db.query(queries[5], function(err, rows) {
              results.suppliers = rows[0].total;

              // Run seventh query - Low Stock
              db.query(queries[6], function(err, rows) {
                results.lowStock = rows[0].total;

                // All done! Send everything back
                res.json({ success: true, stats: results });
              });
            });
          });
        });
      });
    });
  });

});
// ── GET all medicines (both admin and staff can see) ──
router.get('/medicines', function(req, res) {
  db.query('SELECT * FROM Medicines', function(err, rows) {
    if (err) return res.json({ success: false, message: 'Database error.' });
    res.json({ success: true, medicines: rows });
  });
});

// ── ADD a medicine (admin only) ──
router.post('/medicines/add', function(req, res) {
  const { Medicine_Name, Category_Id, Supplier_Id, Price, Description } = req.body;

  const query = `
    INSERT INTO Medicines (Medicine_Name, Category_Id, Supplier_Id, Price, Description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [Medicine_Name, Category_Id, Supplier_Id, Price, Description], function(err) {
    if (err) return res.json({ success: false, message: 'Could not add medicine.' });
    res.json({ success: true, message: 'Medicine added successfully!' });
  });
});

// ── DELETE a medicine (admin only) ──
router.delete('/medicines/delete/:id', function(req, res) {
  const id = req.params.id;

  db.query('DELETE FROM Medicines WHERE Medicine_Id = ?', [id], function(err) {
    if (err) return res.json({ success: false, message: 'Could not delete medicine.' });
    res.json({ success: true, message: 'Medicine deleted successfully!' });
  });
});

// ── GET all batches (both admin and staff can see) ──
router.get('/batches', function(req, res) {
  db.query('SELECT * FROM Batches', function(err, rows) {
    if (err) return res.json({ success: false, message: 'Database error.' });
    res.json({ success: true, batches: rows });
  });
});

// ── ADD a batch (admin only) ──
router.post('/batches/add', function(req, res) {
  const { Medicine_Id, Branch_Id, Quantity, Expiry_Date, Received_Date } = req.body;

  const query = `
    INSERT INTO Batches (Medicine_Id, Branch_Id, Quantity, Expiry_Date, Received_Date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [Medicine_Id, Branch_Id, Quantity, Expiry_Date, Received_Date], function(err) {
    if (err) return res.json({ success: false, message: 'Could not add batch.' });
    res.json({ success: true, message: 'Batch added successfully!' });
  });
});

// ── DELETE a batch (admin only) ──
router.delete('/batches/delete/:id', function(req, res) {
  const id = req.params.id;

  db.query('DELETE FROM Batches WHERE Batch_Id = ?', [id], function(err) {
    if (err) return res.json({ success: false, message: 'Could not delete batch.' });
    res.json({ success: true, message: 'Batch deleted successfully!' });
  });
});
// Make this router available to other files
module.exports = router;