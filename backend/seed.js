require('dotenv').config();
const User = require('./models/User');

const seedUsers = async () => {
  try {
    console.log('🔄 Seeding users (MySQL)...');

    // Check admin
    let existingAdmin = await User.findByEmail('admin@costguard.ai');
    if (!existingAdmin) {
      await User.create({
        email: 'admin@costguard.ai',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@costguard.ai / admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Check demo user
    let existingUser = await User.findByEmail('user@costguard.ai');
    if (!existingUser) {
      await User.create({
        email: 'user@costguard.ai',
        password: 'user123',
        name: 'Demo User',
        role: 'user'
      });
      console.log('✅ Demo user created: user@costguard.ai / user123');
    } else {
      console.log('ℹ️ Demo user already exists');
    }

    console.log('🎉 Seeding complete!');
    console.log('\\nLogin test: POST http://localhost:3000/api/auth/login');
    console.log('Body: {\"email\":\"admin@costguard.ai\", \"password\":\"admin123\"}');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedUsers();
