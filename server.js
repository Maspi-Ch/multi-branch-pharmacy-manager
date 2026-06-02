const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── MySQL Connection ─────────────────────────────────────────────────────────
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmacy'
});

db.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL database');
    }
});

// ─── SERVE INDEX PAGE ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── LOGIN ROUTE ──────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    console.log('Login attempt:', { email, role });

    if (role === 'admin') {
        const sql = 'SELECT * FROM Admins WHERE Email = ? AND Password = ?';
        db.query(sql, [email, password], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                return res.json({ success: true, role: 'admin', user: results[0] });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
            }
        });

    } else if (role === 'staff') {
        const sql = 'SELECT * FROM Staff WHERE Email = ? AND Password = ?';
        db.query(sql, [email, password], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                return res.json({ success: true, role: 'staff', user: results[0] });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid staff credentials' });
            }
        });

    } else {
        return res.status(400).json({ success: false, message: 'Invalid role selected' });
    }
});

// ─── DASHBOARD STATS API ──────────────────────────────────────────────────────

app.get('/api/stats/medicines', (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM Medicines', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ value: result[0].total });
    });
});

app.get('/api/stats/expiry', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total FROM Batches
        WHERE Expiry_Date <= DATE_ADD(CURDATE(), INTERVAL 90 DAY)
        AND Expiry_Date >= CURDATE()
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ value: result[0].total });
    });
});

app.get('/api/stats/batches', (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM Batches', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ value: result[0].total });
    });
});

app.get('/api/stats/branches', (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM Branches', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ value: result[0].total });
    });
});

app.get('/api/stats/sales', (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM Sales', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ value: result[0].total });
    });
});

app.get('/api/stats/suppliers', (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM Suppliers', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ value: result[0].total });
    });
});

app.get('/api/stats/lowstock', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total FROM Batches b
        JOIN Medicines m ON b.Medicine_Id = m.Medicine_Id
        WHERE b.Quantity < m.Min_Stock_Threshold AND b.Quantity > 0
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ value: result[0].total });
    });
});

// ─── FETCH LISTS ──────────────────────────────────────────────────────────────

app.get('/api/medicines', (req, res) => {
    db.query('SELECT * FROM Medicines', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/branches', (req, res) => {
    db.query('SELECT * FROM Branches', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/suppliers', (req, res) => {
    db.query('SELECT * FROM Suppliers', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/batches', (req, res) => {
    const sql = `
        SELECT b.Batch_Id, b.Batch_No, b.Quantity, b.Unit_Price, b.Expiry_Date, b.Received_Date,
               m.Medicine_Name, br.Branch_Name, s.Supplier_Name
        FROM Batches b
        LEFT JOIN Medicines m  ON b.Medicine_Id  = m.Medicine_Id
        LEFT JOIN Branches br  ON b.Branch_Id    = br.Branch_Id
        LEFT JOIN Suppliers s  ON b.Supplier_Id  = s.Supplier_Id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/sales', (req, res) => {
    const sql = `
        SELECT s.Sale_Id, s.Quantity_Sold, s.Sale_Date, s.Sale_Price, b.Batch_No, m.Medicine_Name
        FROM Sales s
        LEFT JOIN Batches b  ON s.Batch_Id    = b.Batch_Id
        LEFT JOIN Medicines m ON b.Medicine_Id = m.Medicine_Id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ─── EXPIRY ALERTS ────────────────────────────────────────────────────────────
app.get('/api/expiry-alerts', (req, res) => {
    const sql = `
        SELECT
            b.Batch_Id,
            b.Batch_No,
            m.Medicine_Name,
            br.Branch_Name,
            b.Quantity,
            b.Expiry_Date,
            DATEDIFF(b.Expiry_Date, CURDATE()) AS Days_Until_Expiry
        FROM Batches b
        LEFT JOIN Medicines m  ON b.Medicine_Id = m.Medicine_Id
        LEFT JOIN Branches br  ON b.Branch_Id   = br.Branch_Id
        WHERE b.Expiry_Date <= DATE_ADD(CURDATE(), INTERVAL 90 DAY)
          AND b.Expiry_Date >= CURDATE()
        ORDER BY b.Expiry_Date ASC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ─── LOW STOCK ────────────────────────────────────────────────────────────────
app.get('/api/low-stock', (req, res) => {
    const sql = `
        SELECT
            b.Batch_Id,
            b.Batch_No,
            m.Medicine_Name,
            br.Branch_Name,
            b.Quantity,
            m.Min_Stock_Threshold,
            (m.Min_Stock_Threshold - b.Quantity) AS Units_Needed
        FROM Batches b
        JOIN  Medicines m     ON b.Medicine_Id = m.Medicine_Id
        LEFT JOIN Branches br ON b.Branch_Id   = br.Branch_Id
        WHERE b.Quantity < m.Min_Stock_Threshold AND b.Quantity > 0
        ORDER BY Units_Needed DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ─── MEDICINES — full 7-field insert ─────────────────────────────────────────
app.post('/api/medicines', (req, res) => {
    const { Medicine_Id, Category_Id, Medicine_Name, Generic_Name, Dosage_Form, Dosage_Strength, Min_Stock_Threshold } = req.body;
    if (!Medicine_Name) return res.status(400).json({ message: 'Medicine name is required' });

    const sql = `
        INSERT INTO Medicines
            (Medicine_Id, Category_Id, Medicine_Name, Generic_Name, Dosage_Form, Dosage_Strength, Min_Stock_Threshold)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql,
        [Medicine_Id || null, Category_Id || null, Medicine_Name, Generic_Name || null,
         Dosage_Form || null, Dosage_Strength || null, Min_Stock_Threshold || null],
        (err) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ success: true });
        }
    );
});

app.delete('/api/medicines/:id', (req, res) => {
    db.query('DELETE FROM Medicines WHERE Medicine_Id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Medicine not found' });
        res.json({ success: true });
    });
});

// ─── BATCHES — full multi-field insert ───────────────────────────────────────
// Resolves Medicine_Name → Medicine_Id, Branch_Name → Branch_Id,
// Supplier_Name → Supplier_Id before inserting.
app.post('/api/batches', (req, res) => {
    const { Batch_Id, Batch_No, Quantity, Unit_Price, Received_Date,
            Medicine_Name, Branch_Name, Supplier_Name } = req.body;

    if (!Batch_No) return res.status(400).json({ message: 'Batch No is required' });

    // Resolve foreign keys by name (all optional — inserts NULL if name not found or not provided)
    const resolveId = (table, nameCol, idCol, nameVal, cb) => {
        if (!nameVal) return cb(null, null);
        db.query(`SELECT ${idCol} FROM ${table} WHERE ${nameCol} = ? LIMIT 1`, [nameVal], (err, rows) => {
            if (err) return cb(err);
            cb(null, rows.length > 0 ? rows[0][idCol] : null);
        });
    };

    resolveId('Medicines', 'Medicine_Name', 'Medicine_Id', Medicine_Name, (err, medId) => {
        if (err) return res.status(500).json({ message: err.message });

        resolveId('Branches', 'Branch_Name', 'Branch_Id', Branch_Name, (err, brId) => {
            if (err) return res.status(500).json({ message: err.message });

            resolveId('Suppliers', 'Supplier_Name', 'Supplier_Id', Supplier_Name, (err, supId) => {
                if (err) return res.status(500).json({ message: err.message });

                const sql = `
                    INSERT INTO Batches
                        (Batch_Id, Batch_No, Quantity, Unit_Price, Received_Date,
                         Medicine_Id, Branch_Id, Supplier_Id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                db.query(sql,
                    [Batch_Id || null, Batch_No, Quantity || null, Unit_Price || null,
                     Received_Date || null, medId, brId, supId],
                    (err) => {
                        if (err) return res.status(500).json({ message: err.message });
                        res.json({ success: true });
                    }
                );
            });
        });
    });
});

app.delete('/api/batches/:id', (req, res) => {
    db.query('DELETE FROM Batches WHERE Batch_Id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Batch not found' });
        res.json({ success: true });
    });
});

// ─── BRANCHES — Branch_Id, Branch_Name, Location, Phone ──────────────────────
app.post('/api/branches', (req, res) => {
    const { Branch_Id, Branch_Name, Location, Phone } = req.body;
    if (!Branch_Name) return res.status(400).json({ message: 'Branch name is required' });

    const sql = `
        INSERT INTO Branches (Branch_Id, Branch_Name, Location, Phone)
        VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [Branch_Id || null, Branch_Name, Location || null, Phone || null], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/branches/:id', (req, res) => {
    db.query('DELETE FROM Branches WHERE Branch_Id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Branch not found' });
        res.json({ success: true });
    });
});

// ─── SUPPLIERS — Supplier_Id, Supplier_Name, Contact_No, Email, Address ──────
app.post('/api/suppliers', (req, res) => {
    const { Supplier_Id, Supplier_Name, Contact_No, Email, Address } = req.body;
    if (!Supplier_Name) return res.status(400).json({ message: 'Supplier name is required' });

    const sql = `
        INSERT INTO Suppliers (Supplier_Id, Supplier_Name, Contact_No, Email, Address)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [Supplier_Id || null, Supplier_Name, Contact_No || null, Email || null, Address || null], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/suppliers/:id', (req, res) => {
    db.query('DELETE FROM Suppliers WHERE Supplier_Id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Supplier not found' });
        res.json({ success: true });
    });
});

// ─── SALES — Sale_Id, Quantity_Sold, Sale_Date, Sale_Price, Batch_No, Medicine_Name ──
// Resolves Batch_No → Batch_Id before inserting.
app.post('/api/sales', (req, res) => {
    const { Sale_Id, Quantity_Sold, Sale_Date, Sale_Price, Batch_No, Medicine_Name } = req.body;
    if (!Quantity_Sold) return res.status(400).json({ message: 'Quantity Sold is required' });

    // Resolve Batch_No → Batch_Id (Medicine_Name is informational, not stored separately in Sales)
    const resolveBatch = (batchNo, cb) => {
        if (!batchNo) return cb(null, null);
        db.query('SELECT Batch_Id FROM Batches WHERE Batch_No = ? LIMIT 1', [batchNo], (err, rows) => {
            if (err) return cb(err);
            cb(null, rows.length > 0 ? rows[0].Batch_Id : null);
        });
    };

    resolveBatch(Batch_No, (err, batchId) => {
        if (err) return res.status(500).json({ message: err.message });

        const sql = `
            INSERT INTO Sales (Sale_Id, Quantity_Sold, Sale_Date, Sale_Price, Batch_Id)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(sql,
            [Sale_Id || null, Quantity_Sold, Sale_Date || null, Sale_Price || null, batchId],
            (err) => {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ success: true });
            }
        );
    });
});

app.delete('/api/sales/:id', (req, res) => {
    db.query('DELETE FROM Sales WHERE Sale_Id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Sale not found' });
        res.json({ success: true });
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 PharmaTrack running at http://localhost:${PORT}`);
});
