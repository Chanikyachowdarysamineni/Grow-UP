const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB Atlas or local MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/grow-up';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });

    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.warn('⚠️ MongoDB connection warning:', error.message);
    console.warn('ℹ️ Server will run but database operations may fail');
    console.warn('📝 To use database features, start MongoDB: mongod');
    // Don't exit - allow server to run anyway
    return null;
  }
};

module.exports = connectDB;
