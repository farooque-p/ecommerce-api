import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected : ${connection.host}`.bgGreen.white);
  } catch (error) {
    console.log("Error While Connecting Database : ", error);
    process.exit(1);
  }
};
