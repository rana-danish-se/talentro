import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import Service from "./models/Service.model.js";
import User from "./models/User.model.js";
import fs from "fs";

configDotenv({ path: "./.env" });

const checkDB = async () => {
  let output = "";
  const log = (msg) => {
    console.log(msg);
    output += msg + "\n";
  };

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      log("MONGODB_URI not found in .env");
      return;
    }
    await mongoose.connect(mongoURI);
    log("Connected to DB");

    const users = await User.find().limit(20);
    log(`Found ${users.length} users`);

    for (const user of users) {
      const services = await Service.find({ userId: user._id });
      log(
        `User: ${user.email} (Slug: ${user.slug}, ID: ${user._id}) - Services Found: ${services.length}`
      );
      if (services.length > 0) {
        log(`  First Service Name: ${services[0].name}`);
      }
    }

    const totalServices = await Service.countDocuments();
    log(`Total Services in 'services' collection: ${totalServices}`);

    fs.writeFileSync("db_check_result.txt", output);
    process.exit(0);
  } catch (err) {
    fs.writeFileSync("db_check_result.txt", output + "\nError: " + err.message);
    process.exit(1);
  }
};

checkDB();
