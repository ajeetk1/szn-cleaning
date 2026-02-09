const db = require('./database');

const stmt = db.prepare("INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)");
stmt.run('admin', 'password123');
stmt.finalize();
console.log("Seeded admin user.");
