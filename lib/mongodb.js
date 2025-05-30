import mongoose from 'mongoose';

const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "parkinglots",
    });
    console.log("Connected to:", mongoose.connection.host);
    console.log("Using DB:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
};

export default connectMongoDB;