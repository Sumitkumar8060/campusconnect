// backend/sql/run_companions_migration.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../src/config/db');

async function migrate() {
    console.log('Running Companions migration...');

    // 1. Inspect activities columns
    const [cols] = await pool.query('DESCRIBE activities');
    const existing = cols.map(c => c.Field);

    if (!existing.includes('host_id')) {
        console.log('Adding host_id column to activities...');
        await pool.query('ALTER TABLE activities ADD COLUMN host_id INT NULL AFTER id');
        await pool.query('UPDATE activities SET host_id = user_id WHERE host_id IS NULL AND user_id IS NOT NULL');
        await pool.query('ALTER TABLE activities MODIFY COLUMN host_id INT NOT NULL');
        try {
            await pool.query('ALTER TABLE activities ADD CONSTRAINT fk_activities_host FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE');
        } catch (e) {
            console.log('Foreign key may already exist:', e.message);
        }
    }

    if (!existing.includes('description')) {
        console.log('Adding description column to activities...');
        await pool.query('ALTER TABLE activities ADD COLUMN description TEXT NULL AFTER title');
        await pool.query("UPDATE activities SET description = title WHERE description IS NULL");
    }

    if (!existing.includes('activity_date')) {
        console.log('Adding activity_date column to activities...');
        await pool.query('ALTER TABLE activities ADD COLUMN activity_date VARCHAR(100) NULL AFTER location');
        await pool.query("UPDATE activities SET activity_date = date WHERE activity_date IS NULL AND date IS NOT NULL");
    }

    if (!existing.includes('activity_time')) {
        console.log('Adding activity_time column to activities...');
        await pool.query('ALTER TABLE activities ADD COLUMN activity_time VARCHAR(50) NULL AFTER activity_date');
        await pool.query("UPDATE activities SET activity_time = '06:00 PM' WHERE activity_time IS NULL");
    }

    if (!existing.includes('total_slots')) {
        console.log('Adding total_slots column to activities...');
        await pool.query('ALTER TABLE activities ADD COLUMN total_slots INT NOT NULL DEFAULT 4 AFTER activity_time');
    }

    if (!existing.includes('available_slots')) {
        console.log('Adding available_slots column to activities...');
        await pool.query('ALTER TABLE activities ADD COLUMN available_slots INT NOT NULL DEFAULT 3 AFTER total_slots');
    }

    if (!existing.includes('requirements')) {
        console.log('Adding requirements column to activities...');
        await pool.query("ALTER TABLE activities ADD COLUMN requirements TEXT NULL AFTER status");
        await pool.query("UPDATE activities SET requirements = 'Be on time and bring your student ID.' WHERE requirements IS NULL");
    }

    if (!existing.includes('image')) {
        console.log('Adding image column to activities...');
        await pool.query('ALTER TABLE activities ADD COLUMN image VARCHAR(500) NULL AFTER requirements');
    }

    // Change status column to VARCHAR or flexible ENUM if needed
    try {
        await pool.query("ALTER TABLE activities MODIFY COLUMN status VARCHAR(50) DEFAULT 'open'");
    } catch (err) {
        console.log('Modify status column error (ignored):', err.message);
    }

    // 2. Create activity_requests table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS activity_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            activity_id INT NOT NULL,
            requester_id INT NOT NULL,
            note TEXT DEFAULT NULL,
            status ENUM('pending', 'accepted', 'rejected', 'cancelled') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_actreq_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
            CONSTRAINT fk_actreq_user FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_actreq_activity (activity_id),
            INDEX idx_actreq_requester (requester_id)
        )
    `);

    console.log('Companions migration finished successfully.');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
