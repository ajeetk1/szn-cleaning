const db = require('./database');

// All content that should be in the database
const content = [
    // --- GLOBAL (Header & Footer) ---
    { key: 'header_logo_img', value: 'images/header_logo.png' },
    { key: 'footer_logo_img', value: 'images/footer_logo_home.png' },
    { key: 'footer_desc_text', value: 'Professional cleaning services for your home and office.' },
    { key: 'copyright_text', value: 'Copyright@2026 SZN Cleaning. All rights reserved.' },

    // --- HOME PAGE ---
    // Hero
    { key: 'hero_title', value: 'Professional Cleaning Made Simple.' },
    { key: 'hero_subtitle', value: 'We are ready to clean up your place and verify it is clean. Fast, reliable and eco-friendly methods and 100% satisfaction guaranteed.' },
    { key: 'cta_button_text', value: 'Get a Quote' },

    // Process
    { key: 'process_1_title', value: '1. Get a Booking' },
    { key: 'process_1_desc', value: 'Fill out the form to get a free quote.' },
    { key: 'process_1_icon', value: 'calendar_today' },
    { key: 'process_2_title', value: '2. We Clean' },
    { key: 'process_2_desc', value: 'Our team arrives and cleans your space.' },
    { key: 'process_2_icon', value: 'cleaning_services' },
    { key: 'process_3_title', value: '3. You Relax' },
    { key: 'process_3_desc', value: 'Enjoy your clean space with peace of mind.' },
    { key: 'process_3_icon', value: 'thumb_up' },

    // About Section (Home)
    { key: 'about_tagline', value: 'Who We Are' },
    { key: 'about_title', value: 'About Us' },
    { key: 'about_desc', value: 'We are a professional cleaning company dedicated to making your life easier.' },
    { key: 'about_img', value: 'images/house_cleaning.png' },
    { key: 'about_btn_text', value: 'More About Us' },

    // Services Headers (Home)
    { key: 'services_tagline', value: 'Our Services' },
    { key: 'services_title', value: 'Our Premium Services' },
    { key: 'services_desc', value: 'We offer a wide range of cleaning services to meet your needs.' },
    { key: 'services_header_icon', value: 'cleaning_services' },

    // Testimonials (Home)
    { key: 'testimonials_title', value: 'What Our Customers Say' },
    { key: 'testi_1_text', value: '"The best cleaning service I have ever used. Highly recommended!"' },
    { key: 'testi_1_name', value: 'John Doe' },
    { key: 'testi_1_role', value: 'Home Owner' },
    { key: 'testi_2_text', value: '"Professional, on time, and very thorough. Will use again."' },
    { key: 'testi_2_name', value: 'Jane Smith' },
    { key: 'testi_2_role', value: 'Office Manager' },
    { key: 'testi_3_text', value: '"Great attention to detail. My house looks brand new."' },
    { key: 'testi_3_name', value: 'Mike Johnson' },
    { key: 'testi_3_role', value: 'Real Estate Agent' },

    // CTA Strip (Home)
    { key: 'cta_title', value: 'Get Your Free Quote' },
    { key: 'cta_desc', value: 'Ready to get started? Contact us today for a free consultation.' },
    { key: 'cta_phone', value: '0466 532 362' },
    { key: 'cta_email', value: 'info@cleaningservice.com' },
    { key: 'cta_btn', value: 'Contact Us' },

    // --- ABOUT PAGE ---
    { key: 'about_tagline_text', value: 'Who We Are' },
    { key: 'about_main_title', value: 'Professional Cleaning With A Personal Touch' },
    { key: 'about_main_desc', value: 'Founded in 2010, SZN Cleaning has been serving the community with top-notch cleaning services. Our team is vetted, trained, and insured to provide you with peace of mind.' },
    { key: 'about_desc_2', value: 'We use eco-friendly products that are safe for your family and pets. Our mission is to provide a clean and healthy environment for our clients.' },
    { key: 'about_image_img', value: 'images/house_cleaning.png' },
    { key: 'about_values_title', value: 'Our Values' },
    { key: 'value_1_title', value: 'Integrity' },
    { key: 'value_1_desc', value: 'We are honest and transparent in our pricing and services.' },
    { key: 'value_2_title', value: 'Excellence' },
    { key: 'value_2_desc', value: 'We strive for perfection in every job we do.' },
    { key: 'value_3_title', value: 'Care' },
    { key: 'value_3_desc', value: 'We treat your home as if it were our own.' },

    // --- SERVICES PAGE ---
    { key: 'services_hero_title', value: 'Our Services' },
    { key: 'services_hero_desc', value: 'Comprehensive cleaning solutions for every need.' },
    { key: 'included_title', value: "What's Included in Every Service" },
    { key: 'included_subtitle', value: 'Professional standards applied across all our offerings' },
    { key: 'inc_1_title', value: 'Background Checked Team' },
    { key: 'inc_1_desc', value: 'All staff thoroughly vetted for your safety and peace of mind' },
    { key: 'inc_1_icon', value: 'verified_user' },
    { key: 'inc_2_title', value: 'Fully Insured' },
    { key: 'inc_2_desc', value: 'Complete coverage for any accidental damage during service' },
    { key: 'inc_2_icon', value: 'lock' },
    { key: 'inc_3_title', value: 'Eco-Friendly Products' },
    { key: 'inc_3_desc', value: 'Safe for pets, children, and the environment' },
    { key: 'inc_3_icon', value: 'eco' },
    { key: 'inc_4_title', value: 'Flexible Scheduling' },
    { key: 'inc_4_desc', value: 'Weekends, evenings, and same-day services available' },
    { key: 'inc_4_icon', value: 'schedule' },
    { key: 'inc_5_title', value: 'Quality Guarantee' },
    { key: 'inc_5_desc', value: "Unsatisfied? We'll re-clean at no additional cost" },
    { key: 'inc_5_icon', value: 'star_border' },
    { key: 'inc_6_title', value: 'No Hidden Fees' },
    { key: 'inc_6_desc', value: 'Transparent pricing with upfront quotes' },
    { key: 'inc_6_icon', value: 'bolt' },
    { key: 'services_banner_bg', value: 'images/deep_cleaning.png' },
    { key: 'services_banner_title', value: 'A cleaner space is just a click away!' },
    { key: 'services_banner_desc', value: 'Why waste your valuable time on cleaning when you can leave it to the professionals? Our expert team is ready.' },
    { key: 'services_banner_btn', value: 'Get Your Free Quote' },

    // --- GALLERY PAGE ---
    { key: 'gallery_hero_title', value: 'Our Work' },
    { key: 'gallery_hero_desc', value: 'See the difference we make. Before and after shots of our cleaning projects.' },

    // --- CONTACT PAGE ---
    { key: 'contact_hero_title', value: 'Contact Us' },
    { key: 'contact_hero_desc', value: "We'd love to hear from you. Reach out to us for any questions or quotes." },
    { key: 'phone_number', value: '0466 532 362' },
    { key: 'email', value: 'info@cleaningservice.com' },
    { key: 'contact_address', value: '123 Cleaning St, Clean City, ST 12345' },
];

// Default services
const services = [
    // { title: 'Regular House Cleaning', description: 'Weekly or bi-weekly cleaning for your home', icon: 'home' },
    // { title: 'Deep Cleaning', description: 'Thorough cleaning including hard-to-reach areas', icon: 'cleaning_services' },
    // { title: 'Office Cleaning', description: 'Professional office space cleaning', icon: 'business' },
    // { title: 'Move-In/Move-Out', description: 'Complete cleaning for moving scenarios', icon: 'moving' },
    // { title: 'Carpet Cleaning', description: 'Professional carpet and upholstery cleaning', icon: 'dry_cleaning' },
    // { title: 'Post-Construction', description: 'Cleanup after renovation and construction', icon: 'construction' },
];

// Default admin (change this!)
const admin = {
    username: 'admin',
    password: 'admin123',
};

console.log('🌱 Starting database seeding...\n');

db.serialize(() => {
    // Seed content
    console.log('📝 Seeding content...');
    const contentStmt = db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)");
    let contentCount = 0;

    content.forEach(item => {
        contentStmt.run(item.key, item.value, (err) => {
            if (err) {
                console.error(`❌ Error inserting ${item.key}:`, err.message);
            }
            contentCount++;
            if (contentCount === content.length) {
                console.log(`✅ Content seeded (${content.length} items)\n`);
            }
        });
    });
    contentStmt.finalize();

    // Seed services
    console.log('🛠️  Seeding services...');
    // Clear existing services to ensure exact list matches
    db.run("DELETE FROM services", (err) => {
        if (err) {
            console.error("❌ Error clearing services table:", err.message);
        } else {
            console.log("🧹 Cleared existing services.");
        }

        const servicesStmt = db.prepare("INSERT INTO services (title, description, icon) VALUES (?, ?, ?)");
        let servicesCount = 0;

        services.forEach(service => {
            servicesStmt.run(service.title, service.description, service.icon, (err) => {
                if (err) {
                    console.error(`❌ Error inserting service ${service.title}:`, err.message);
                }
                servicesCount++;
                if (servicesCount === services.length) {
                    console.log(`✅ Services seeded (${services.length} items)\n`);
                }
            });
        });
        servicesStmt.finalize();
    });

    // Seed admin
    console.log('👤 Seeding admin user...');
    db.run(
        "INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)",
        [admin.username, admin.password],
        function (err) {
            if (err) {
                console.error('❌ Error inserting admin:', err.message);
            } else {
                console.log(`✅ Admin user seeded\n`);
            }

            // Print completion message
            console.log('═══════════════════════════════════════');
            console.log('✨ Database seeding complete!');
            console.log('═══════════════════════════════════════');
            console.log('\n📞 Phone number: 0466 532 362');
            console.log('📧 Email: info@cleaningservice.com');
            console.log('🔐 Admin credentials: admin / admin123');
            console.log('\n⚠️  IMPORTANT: Change the admin password after first login!\n');
        }
    );
});
