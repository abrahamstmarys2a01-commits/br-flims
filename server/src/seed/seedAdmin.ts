import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { AdminUser } from '../models/AdminUser.js';
import { INITIAL_ADMIN } from './seedData.js';

export const seedAdmin = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || INITIAL_ADMIN.email;
  const password = process.env.ADMIN_PASSWORD || INITIAL_ADMIN.password;
  const name = process.env.ADMIN_NAME || INITIAL_ADMIN.name;

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = 'superadmin';
    existing.isActive = true;
    await existing.save();
    console.log(`[Admin Seeder] Updated existing superadmin: ${email} with specified credentials.`);
  } else {
    await AdminUser.create({
      name,
      email,
      passwordHash,
      role: 'superadmin',
      isActive: true,
    });
    console.log(`[Admin Seeder] Created initial superadmin: ${email}`);
  }
};

if (process.argv[1]?.endsWith('seedAdmin.ts') || process.argv[1]?.endsWith('seedAdmin.js')) {
  seedAdmin()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Admin seeding failed:', err);
      await disconnectDB();
      process.exit(1);
    });
}
