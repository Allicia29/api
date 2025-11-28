const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

// Initialize Database
const db = new sqlite3.Database(':memory:'); // Using in-memory DB for simplicity as per initial plan, but structure is SQL

db.serialize(() => {
    // Create Order table
    db.run(`CREATE TABLE IF NOT EXISTS "Order" (
        orderId TEXT PRIMARY KEY,
        value REAL,
        creationDate TEXT
    )`);

    // Create Items table
    db.run(`CREATE TABLE IF NOT EXISTS Items (
        orderId TEXT,
        productId TEXT,
        quantity INTEGER,
        price REAL,
        FOREIGN KEY(orderId) REFERENCES "Order"(orderId)
    )`);
});

// Create a new order
app.post('/order', (req, res) => {
    const { value, items } = req.body;
    const orderId = 'v' + Math.floor(Math.random() * 100000000) + 'vdb';
    const creationDate = new Date().toISOString();

    db.serialize(() => {
        const stmt = db.prepare('INSERT INTO "Order" (orderId, value, creationDate) VALUES (?, ?, ?)');
        stmt.run(orderId, value, creationDate, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (items && items.length > 0) {
                const itemStmt = db.prepare('INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)');
                items.forEach(item => {
                    itemStmt.run(orderId, item.productId, item.quantity, item.price);
                });
                itemStmt.finalize();
            }

            res.status(201).json({ orderId, value, creationDate, items });
        });
        stmt.finalize();
    });
});

// List all orders
app.get('/order/list', (req, res) => {
    db.all('SELECT * FROM "Order"', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get order by ID
app.get('/order/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM "Order" WHERE orderId = ?', [id], (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (order) {
            db.all('SELECT * FROM Items WHERE orderId = ?', [id], (err, items) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                order.items = items;
                res.json(order);
            });
        } else {
            res.status(404).send('Order not found');
        }
    });
});

// Update order
app.put('/order/:id', (req, res) => {
    const id = req.params.id;
    const { value } = req.body; // Assuming only value update for simplicity based on previous code, can be expanded

    db.run('UPDATE "Order" SET value = ? WHERE orderId = ?', [value, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes > 0) {
            res.json({ message: 'Order updated', orderId: id, value });
        } else {
            res.status(404).send('Order not found');
        }
    });
});

// Delete order
app.delete('/order/:id', (req, res) => {
    const id = req.params.id;
    db.serialize(() => {
        db.run('DELETE FROM Items WHERE orderId = ?', [id]);
        db.run('DELETE FROM "Order" WHERE orderId = ?', [id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes > 0) {
                res.json({ message: 'Order deleted', orderId: id });
            } else {
                res.status(404).send('Order not found');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
