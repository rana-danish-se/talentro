import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import Service from "./models/Service.model.js";
import User from "./models/User.model.js";

configDotenv({ path: "../.env" }); // Adjust if .env is in root

const checkDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/talentro";
    await mongoose.connect(mongoURI);
    console.log("Connected to DB");

    const users = await User.find().limit(10);
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      const services = await Service.find({ userId: user._id });
      console.log(
        `User: ${user.email} (Slug: ${user.slug}, ID: ${user._id}) - Services Found: ${services.length}`
      );
    }

    const totalServices = await Service.countDocuments();
    console.log(`Total Services in 'services' collection: ${totalServices}`);

    process.exit(0);
  } catch (err) {
    console.error("Error during DB check:", err);
    process.exit(1);
  }
};

checkDB();
