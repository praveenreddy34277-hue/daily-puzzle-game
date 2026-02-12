(async () => {
  try {
    const { connectMongo } = await import('../lib/mongo');
    const { User } = await import('../lib/models/User');
    await connectMongo();
    await User.init();
    console.log('Mongo migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration error', err);
    process.exit(1);
  }
})();
