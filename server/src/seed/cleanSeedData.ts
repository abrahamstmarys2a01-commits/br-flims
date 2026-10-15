import { connectDB, disconnectDB } from '../config/db.js';
import { Movie } from '../models/Movie.js';

export const cleanSeedData = async () => {
  console.log('=== Cleaning Mock Seed Data from MongoDB Atlas ===');
  await connectDB();

  const seedSlugs = ['lenin-pandiyan', 'train'];
  const res = await Movie.deleteMany({ slug: { $in: seedSlugs } });
  console.log(`[Clean] Deleted ${res.deletedCount} mock seed movie records from database.`);

  await disconnectDB();
  console.log('=== Cleanup Complete ===');
};

if (process.argv[1]?.endsWith('cleanSeedData.ts') || process.argv[1]?.endsWith('cleanSeedData.js')) {
  cleanSeedData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Clean error:', err);
      process.exit(1);
    });
}
