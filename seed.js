// Simple seed script to create an initial admin user if none exists
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SyncSpace';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async ()=>{
    console.log('Mongo connected for seeding');
    const adminEmail = 'admin@syncspace.test';
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin already exists:', adminEmail);
      process.exit(0);
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    const user = new User({ name: 'Admin', email: adminEmail, password: hash, role: 'admin' });
    await user.save();
    console.log('Created admin:', adminEmail, 'password: admin123');
    process.exit(0);
  })
  .catch(err=>{ console.error(err); process.exit(1); });
