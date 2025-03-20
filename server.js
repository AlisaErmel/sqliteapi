const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Connect to the SQLite database
const dbPath = process.env.DB_PATH || './sqliteapi.db';
const db = new sqlite3.Database('./sqliteapi.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// GET expenses
app.get('/api/expenses', (req, res) => {
    db.all('SELECT * FROM expenses', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// GET shifts
app.get('/api/shifts', (req, res) => {
    db.all('SELECT * FROM shifts', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// DELETE expense by id
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM expenses WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: `Expense with ID ${id} deleted` });
        }
    });
});

// DELETE shift by id
app.delete('/api/shifts/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM shifts WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: `Shift with ID ${id} deleted` });
        }
    });
});

// ADD expense
app.post('/api/expenses', (req, res) => {
    const { category, amount, date, comment } = req.body;
    db.run(
        'INSERT INTO expenses (category, amount, date, comment) VALUES (?, ?, ?, ?)',
        [category, amount, date, comment],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Expense added successfully', id: this.lastID });
            }
        }
    );
});

// ADD shift
app.post('/api/shifts', (req, res) => {
    const { date, hours, rate } = req.body;
    db.run(
        'INSERT INTO shifts (date, hours, rate) VALUES (?, ?, ?)',
        [date, hours, rate],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Shift added successfully', id: this.lastID });
            }
        }
    );
});

// UPDATE expense by id
app.put('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    const { category, amount, date, comment } = req.body;
    db.run(
        'UPDATE expenses SET category = ?, amount = ?, date = ?, comment = ? WHERE id = ?',
        [category, amount, date, comment, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: `Expense with ID ${id} updated` });
            }
        }
    );
});

// UPDATE shift by id
app.put('/api/shifts/:id', (req, res) => {
    const { id } = req.params;
    const { date, hours, rate } = req.body;
    db.run(
        'UPDATE shifts SET date = ?, hours = ?, rate = ? WHERE id = ?',
        [date, hours, rate, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: `Shift with ID ${id} updated` });
            }
        }
    );
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
