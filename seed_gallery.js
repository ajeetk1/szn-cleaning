const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'cleaning.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
    seedGallery();
});

function seedGallery() {
    const galleryItems = [
        { title: 'House Cleaning', image_url: '/images/house_cleaning.png' },
        { title: 'Office Cleaning', image_url: '/images/office_cleaning.png' },
        { title: 'Deep Cleaning', image_url: '/images/deep_cleaning.png' },
        { title: 'Move In/Out', image_url: '/images/move_in_out.png' },
        { title: 'Carpet & Upholstery', image_url: '/images/carpet_upholstery.png' },
        { title: 'Post-Construction', image_url: '/images/post_construction.png' }
    ];

    db.serialize(() => {
        // Clear existing gallery items to avoid duplicates/confusion for this task
        db.run("DELETE FROM gallery", (err) => {
            if (err) console.error("Error clearing gallery:", err.message);
            else console.log("Cleared existing gallery items.");
        });

        const stmt = db.prepare("INSERT INTO gallery (title, image_url) VALUES (?, ?)");
        galleryItems.forEach(item => {
            stmt.run(item.title, item.image_url, (err) => {
                if (err) console.error('Error inserting item:', item.title, err.message);
                else console.log('Inserted:', item.title);
            });
        });
        stmt.finalize(() => {
            console.log("Seeding complete.");
            db.close();
        });
    });
}
