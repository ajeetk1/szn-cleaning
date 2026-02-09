const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.use(session({
    secret: 'szn-cleaning-secret-key',
    resave: false,
    saveUninitialized: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// Serve admin login page at /admin/login
app.get(['/admin/login', '/admin/login.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve admin page at /admin
app.get(['/admin', '/admin/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Auth Middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// API: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for: ${username} with password: ${password}`);
    db.get("SELECT * FROM admins WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            console.error("Login DB Error:", err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            console.log("Login successful for:", username);
            req.session.userId = row.id;
            res.json({ message: 'Login successful' });
        } else {
            console.log("Login failed: Invalid credentials");
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// API: Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// API: Check Auth Status
app.get('/api/check-auth', (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

// API: Get all content
app.get('/api/content', (req, res) => {
    db.all("SELECT * FROM content", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// API: Update content (Protected)
app.post('/api/content', requireAuth, (req, res) => {
    const updates = req.body; // Expecting an array of {key, value} objects

    if (!Array.isArray(updates)) {
        res.status(400).json({ "error": "Invalid input format. Expected an array." });
        return;
    }

    const stmt = db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)");

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        updates.forEach(item => {
            stmt.run(item.key, item.value);
        });
        db.run("COMMIT", (err) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({ "message": "Content updated successfully" });
        });
        stmt.finalize();
    });
});

// API: Get all services
app.get('/api/services', (req, res) => {
    db.all("SELECT * FROM services", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// API: Add new service (Protected)
app.post('/api/services', requireAuth, (req, res) => {
    const { title, description, icon } = req.body;
    db.run("INSERT INTO services (title, description, icon) VALUES (?, ?, ?)", [title, description, icon], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "id": this.lastID });
    });
});

// API: Update service (Protected)
app.put('/api/services/:id', requireAuth, (req, res) => {
    const { title, description, icon } = req.body;
    const id = req.params.id;
    db.run("UPDATE services SET title = ?, description = ?, icon = ? WHERE id = ?", [title, description, icon, id], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "updated", changes: this.changes });
    });
});

// API: Delete service (Protected)
app.delete('/api/services/:id', requireAuth, (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM services WHERE id = ?", id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "deleted", changes: this.changes });
    });
});

// API: Create a booking
app.post('/api/bookings', (req, res) => {
    const { name, phone, service, email, booking_date, booking_time } = req.body;
    db.run("INSERT INTO bookings (name, phone, service, email, booking_date, booking_time) VALUES (?, ?, ?, ?, ?, ?)",
        [name, phone, service, email, booking_date, booking_time], function (err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({ "message": "success", "id": this.lastID });
        });
});

// API: Get all bookings (Protected)
app.get('/api/bookings', requireAuth, (req, res) => {
    db.all("SELECT * FROM bookings ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// API: Get all gallery images
app.get('/api/gallery', (req, res) => {
    db.all("SELECT * FROM gallery ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// API: Add gallery image (Protected)
app.post('/api/gallery', requireAuth, (req, res) => {
    const { image_url, title } = req.body;
    db.run("INSERT INTO gallery (image_url, title) VALUES (?, ?)", [image_url, title], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "id": this.lastID });
    });
});

// API: Delete gallery image (Protected)
app.delete('/api/gallery/:id', requireAuth, (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM gallery WHERE id = ?", id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "deleted", changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
