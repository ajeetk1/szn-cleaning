const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'cleaning.db');
const db = new sqlite3.Database(dbPath);

const extendedDescription = " We provide top-notch service with attention to detail. Our team is trained to handle all your cleaning needs efficiently and professionally.";

db.serialize(() => {
    db.all("SELECT id, description FROM services", (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        const stmt = db.prepare("UPDATE services SET description = ? WHERE id = ?");

        rows.forEach(row => {
            const newDesc = row.description + extendedDescription;
            stmt.run(newDesc, row.id);
        });

        stmt.finalize(() => {
            console.log("Services updated with more text.");
            db.close();
        });
    });
});
