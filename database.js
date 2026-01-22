const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'cleaning.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Content table for dynamic text/images
        db.run(`CREATE TABLE IF NOT EXISTS content (
            key TEXT PRIMARY KEY,
            value TEXT,
            type TEXT DEFAULT 'text' -- 'text', 'image', 'icon'
        )`);

        // Bookings/Quotes table
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT,
            service TEXT,
            zipcode TEXT,
            booking_date TEXT,
            booking_time TEXT,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Migration to add columns if they don't exist (for existing DBs)
        db.run("ALTER TABLE bookings ADD COLUMN booking_date TEXT", (err) => { });
        db.run("ALTER TABLE bookings ADD COLUMN booking_time TEXT", (err) => { });
        db.run("ALTER TABLE bookings ADD COLUMN email TEXT", (err) => { });

        // Services table for the services section
        db.run(`CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            icon TEXT
        )`);

        // Admins table
        db.run(`CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`);

        // Gallery table
        db.run(`CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT,
            title TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed initial content if empty
        db.get("SELECT count(*) as count FROM content", (err, row) => {
            if (!err && row && row.count === 0) {
                seedContent();
            }
        });

        db.get("SELECT count(*) as count FROM services", (err, row) => {
            if (!err && row && row.count === 0) {
                seedServices();
            }
        });

        db.get("SELECT count(*) as count FROM admins", (err, row) => {
            if (!err && row && row.count === 0) {
                seedAdmin();
            }
        });
    });
}

function seedAdmin() {
    const stmt = db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
    stmt.run('admin', 'password123');
    stmt.finalize();
    console.log("Seeded default admin.");
}

function seedContent() {
    const initialContent = [
        { key: 'hero_title', value: 'Professional Cleaning Made Simple.' },
        { key: 'hero_subtitle', value: 'We are ready to clean up your place and verify it is clean. Fast, reliable and eco-friendly methods and 100% satisfaction guaranteed.' },
        { key: 'cta_button_text', value: 'Get a Quote' },
        { key: 'phone_number', value: '+1 (234) 567-890' },
        { key: 'email', value: 'info@cleaningservice.com' },
        { key: 'process_1_title', value: '1. Get a Quote' },
        { key: 'process_1_desc', value: 'Fill out the form to get a free quote.' },
        { key: 'process_2_title', value: '2. We Clean' },
        { key: 'process_2_desc', value: 'Our team arrives and cleans your space.' },
        { key: 'why_us_title', value: 'You Can Depend On Us For Professional Quality' },
        { key: 'why_us_desc', value: 'We are dedicated to providing the best cleaning service.' },

        // About Page
        { key: 'about_hero_title', value: 'About Us' },
        { key: 'about_hero_desc', value: 'We are a professional cleaning company dedicated to making your life easier.' },
        { key: 'about_main_title', value: 'Professional Cleaning With A Personal Touch' },
        { key: 'about_main_desc', value: 'Founded in 2010, SZN Cleaning has been serving the community with top-notch cleaning services. Our team is vetted, trained, and insured to provide you with peace of mind.' },

        // Services Page - Included Section
        { key: 'included_title', value: "What's Included in Every Service" },
        { key: 'included_subtitle', value: 'Professional standards applied across all our offerings' },
        { key: 'inc_1_title', value: 'Background Checked Team' }, { key: 'inc_1_desc', value: 'All staff thoroughly vetted for your safety and peace of mind' }, { key: 'inc_1_icon', value: 'verified_user' },
        { key: 'inc_2_title', value: 'Fully Insured' }, { key: 'inc_2_desc', value: 'Complete coverage for any accidental damage during service' }, { key: 'inc_2_icon', value: 'lock' },
        { key: 'inc_3_title', value: 'Eco-Friendly Products' }, { key: 'inc_3_desc', value: 'Safe for pets, children, and the environment' }, { key: 'inc_3_icon', value: 'eco' },
        { key: 'inc_4_title', value: 'Flexible Scheduling' }, { key: 'inc_4_desc', value: 'Weekends, evenings, and same-day services available' }, { key: 'inc_4_icon', value: 'schedule' },
        { key: 'inc_5_title', value: 'Quality Guarantee' }, { key: 'inc_5_desc', value: "Unsatisfied? We'll re-clean at no additional cost" }, { key: 'inc_5_icon', value: 'star_border' },
        { key: 'inc_6_title', value: 'No Hidden Fees' }, { key: 'inc_6_desc', value: 'Transparent pricing with upfront quotes' }, { key: 'inc_6_icon', value: 'bolt' },

        // Contact Page
        { key: 'contact_hero_title', value: 'Contact Us' },
        { key: 'contact_hero_desc', value: "We'd love to hear from you. Reach out to us for any questions or quotes." },
        { key: 'contact_address', value: '123 Cleaning St, Clean City, ST 12345' },
    ];

    const stmt = db.prepare("INSERT INTO content (key, value) VALUES (?, ?)");
    initialContent.forEach(item => {
        stmt.run(item.key, item.value);
    });
    stmt.finalize();
    console.log("Seeded initial content.");
}

function seedServices() {
    const services = [
        { title: 'House Cleaning', description: 'Complete house cleaning service. We provide top-notch service with attention to detail. Our team is trained to handle all your cleaning needs efficiently and professionally.', icon: 'home' },
        { title: 'Office Cleaning', description: 'Professional office cleaning. We provide top-notch service with attention to detail. Our team is trained to handle all your cleaning needs efficiently and professionally.', icon: 'business' },
        { title: 'Deep Cleaning', description: 'Thorough deep cleaning. We provide top-notch service with attention to detail. Our team is trained to handle all your cleaning needs efficiently and professionally.', icon: 'cleaning_services' },
        { title: 'Move In/Out', description: 'Cleaning for moving in or out. We provide top-notch service with attention to detail. Our team is trained to handle all your cleaning needs efficiently and professionally.', icon: 'local_shipping' },
        { title: 'Carpet & Upholstery', description: 'Steam cleaning for carpets. We provide top-notch service with attention to detail. Our team is trained to handle all your cleaning needs efficiently and professionally.', icon: 'layers' },
        { title: 'Post-Construction', description: 'Cleaning after renovation. We provide top-notch service with attention to detail. Our team is trained to handle all your cleaning needs efficiently and professionally.', icon: 'construction' }
    ];

    const stmt = db.prepare("INSERT INTO services (title, description, icon) VALUES (?, ?, ?)");
    services.forEach(service => {
        stmt.run(service.title, service.description, service.icon);
    });
    stmt.finalize();
    console.log("Seeded initial services.");
}

module.exports = db;
