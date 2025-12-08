// services/cleanupUnverified.js
import User from '../models/User.model.js';
import Profile from '../models/Profile.model.js';
import cron from 'node-cron';

/**
 * Delete unverified users older than 24 hours
 */
export const cleanupUnverifiedUsers = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find all unverified users created more than 24 hours ago
    const unverifiedUsers = await User.find({
      isVerified: false,
      createdAt: { $lt: twentyFourHoursAgo }
    });

    if (unverifiedUsers.length === 0) {
      console.log('✅ No unverified users to clean up');
      return;
    }

    // Delete each user and their profile
    let deletedCount = 0;
    for (const user of unverifiedUsers) {
      try {
        await Profile.findOneAndDelete({ userId: user._id });
        await User.findByIdAndDelete(user._id);
        deletedCount++;
        console.log(`🗑️  Deleted unverified user: ${user.email}`);
      } catch (err) {
        console.error(`❌ Error deleting user ${user.email}:`, err);
      }
    }

    console.log(`✅ Cleanup complete: ${deletedCount} unverified users deleted`);
    
    return {
      success: true,
      deletedCount,
      message: `Deleted ${deletedCount} unverified users`
    };

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Schedule automatic cleanup
 * Runs every hour to check for expired unverified accounts
 */
export const scheduleCleanup = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🔄 Running scheduled cleanup of unverified users...');
    await cleanupUnverifiedUsers();
  });
  console.log('⏰ Scheduled cleanup job initialized (runs every hour)');
};

