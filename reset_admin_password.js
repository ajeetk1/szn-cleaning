const db = require('./database');

db.serialize(() => {
    // Check what's currently there
    db.all("SELECT * FROM admins", (err, rows) => {
        if (err) {
            console.error("Error reading admins:", err);
            return;
        }
        console.log("Current admins:", rows);

        // Force update password
        const stmt = db.prepare("UPDATE admins SET password = ? WHERE username = ?");
        stmt.run('password123', 'admin', function (err) {
            if (err) {
                console.error("Error updating password:", err);
            } else {
                console.log(`Updated password for admin. Changes: ${this.changes}`);
                if (this.changes === 0) {
                    // If no changes, maybe user doesn't exist? Insert it.
                    console.log("Admin user not found, inserting...");
                    const insert = db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
                    insert.run('admin', 'password123', (err) => {
                        if (err) console.error("Error inserting admin:", err);
                        else console.log("Inserted admin user.");
                    });
                    insert.finalize();
                }
            }
        });
        stmt.finalize();
    });
});
