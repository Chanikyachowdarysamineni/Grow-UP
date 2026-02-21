const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB Atlas or local MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/grow-up';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
