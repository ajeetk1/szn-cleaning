const db = require('./database');

console.log('Updating phone numbers in database...');

db.serialize(() => {
    // Update cta_phone (home page CTA section)
    db.run(
        "UPDATE content SET value = ? WHERE key = ?",
        ['0466 532 362', 'cta_phone'],
        function(err) {
            if (err) {
                console.error('Error updating cta_phone:', err.message);
            } else {
                console.log('✓ Updated cta_phone to 0466 532 362');
            }
        }
    );

    // Insert/Update phone_number (contact page)
    db.run(
        "INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)",
        ['phone_number', '0466 532 362'],
        function(err) {
            if (err) {
                console.error('Error updating phone_number:', err.message);
            } else {
                console.log('✓ Updated phone_number to 0466 532 362');
            }
            db.close();
        }
    );
});
