const db = require('./database');

db.serialize(() => {
    const stmt = db.prepare("UPDATE admins SET password = ? WHERE username = ?");
    stmt.run('admin123', 'admin', function (err) {
        if (err) {
            console.error("Error updating password:", err);
        } else {
            console.log(`Updated password for admin to 'admin123'. Changes: ${this.changes}`);
        }
    });
    stmt.finalize();
});
