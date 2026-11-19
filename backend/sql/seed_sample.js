require('dotenv').config();
const pool = require('../src/config/db');

async function seed() {
  const [users] = await pool.query('SELECT id FROM users WHERE id IN (4, 5)');
  for (const u of users) {
    await pool.query(
      `INSERT INTO activities (user_id, title, category, date, location, companions_count, status, role)
       VALUES
       (?, 'Weekend Badminton Match', 'Sports & Fitness', 'Saturday, 6:00 PM', 'Indoor Sports Complex', 3, 'Upcoming', 'Created by you'),
       (?, 'DSA & LeetCode Study Session', 'Study & Academics', 'Friday, 8:00 PM', 'Central Library Pod 4', 4, 'Active', 'Created by you')`,
      [u.id, u.id]
    );

    await pool.query(
      `INSERT INTO marketplace_listings (user_id, title, service, category, price, status, image, link)
       VALUES
       (?, 'Thomas Calculus 14th Ed + Notes', 'Student Marketplace', 'Books & Study Materials', '₹450', 'Active', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80', '/marketplace'),
       (?, 'Sony WH-CH520 Wireless Headphones', 'Student Marketplace', 'Electronics', '₹1,800', 'Active', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80', '/marketplace')`,
      [u.id, u.id]
    );

    await pool.query(
      `INSERT INTO user_reviews (user_id, reviewer_name, reviewer_dept, reviewer_avatar, rating, service, comment, date)
       VALUES
       (?, 'Karan Mehra', 'Civil Engg, 4th Year', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 5, 'Student Marketplace', 'Super prompt! Met me right outside hostel lobby. Highly recommended!', '2 days ago'),
       (?, 'Sneha Patel', 'Biotech, 3rd Year', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', 5, 'Find Companions', 'Great team player and very punctual for the study meetup.', '1 week ago')`,
      [u.id, u.id]
    );
  }
  console.log('Seeded sample data successfully.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
