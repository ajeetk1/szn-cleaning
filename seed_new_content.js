const db = require('./database');

const newContent = [
    { key: 'about_hero_title', value: 'About Us' },
    { key: 'about_hero_desc', value: 'We are a professional cleaning company dedicated to making your life easier.' },
    { key: 'about_main_title', value: 'Professional Cleaning With A Personal Touch' },
    { key: 'about_main_desc', value: 'Founded in 2010, SZN Cleaning has been serving the community with top-notch cleaning services. Our team is vetted, trained, and insured to provide you with peace of mind.' },
    { key: 'included_title', value: "What's Included in Every Service" },
    { key: 'included_subtitle', value: 'Professional standards applied across all our offerings' },
    { key: 'inc_1_title', value: 'Background Checked Team' }, { key: 'inc_1_desc', value: 'All staff thoroughly vetted for your safety and peace of mind' }, { key: 'inc_1_icon', value: 'verified_user' },
    { key: 'inc_2_title', value: 'Fully Insured' }, { key: 'inc_2_desc', value: 'Complete coverage for any accidental damage during service' }, { key: 'inc_2_icon', value: 'lock' },
    { key: 'inc_3_title', value: 'Eco-Friendly Products' }, { key: 'inc_3_desc', value: 'Safe for pets, children, and the environment' }, { key: 'inc_3_icon', value: 'eco' },
    { key: 'inc_4_title', value: 'Flexible Scheduling' }, { key: 'inc_4_desc', value: 'Weekends, evenings, and same-day services available' }, { key: 'inc_4_icon', value: 'schedule' },
    { key: 'inc_5_title', value: 'Quality Guarantee' }, { key: 'inc_5_desc', value: "Unsatisfied? We'll re-clean at no additional cost" }, { key: 'inc_5_icon', value: 'star_border' },
    { key: 'inc_6_title', value: 'No Hidden Fees' }, { key: 'inc_6_desc', value: 'Transparent pricing with upfront quotes' }, { key: 'inc_6_icon', value: 'bolt' },
    { key: 'contact_hero_title', value: 'Contact Us' },
    { key: 'contact_hero_desc', value: "We'd love to hear from you. Reach out to us for any questions or quotes." },
    { key: 'contact_address', value: '123 Cleaning St, Clean City, ST 12345' },
];

const stmt = db.prepare("INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)");
newContent.forEach(item => {
    stmt.run(item.key, item.value);
});
stmt.finalize();
console.log("Seeded new content keys.");
