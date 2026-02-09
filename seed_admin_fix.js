const db = require('./database');

// Wait for DB connection if needed, but db.prepare might be synchronous enough if DB is open.
// Better to wrap in serialize.
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`, (err) => {
        if (err) console.error("Error creating table:", err);
        else {
            const stmt = db.prepare("INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)");
            stmt.run('admin', 'password123', (err) => {
                if (err) console.error("Error inserting admin:", err);
                else console.log("Seeded admin user.");
                stmt.finalize();
            });
        }
    });
});
