const db = require('./database');

console.log('Updating phone number in database...');

db.serialize(() => {
    db.run(
        "UPDATE content SET value = ? WHERE key = ?",
        ['0466 532 362', 'cta_phone'],
        function(err) {
            if (err) {
                console.error('Error updating cta_phone:', err.message);
            } else {
                console.log('Successfully updated cta_phone to 0466 532 362');
            }
            db.close();
        }
    );
});
