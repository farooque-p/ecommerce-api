import app from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";
import colors from "colors";
import cloudinary from "cloudinary";
import Stripe from "stripe";

config({
  path: "./config/config.env",
});

connectDatabase();

// Stripe Configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port http://localhost:${
      process.env.PORT
    } on ${(process.env.NODE_ENV = "development")} Mode`.bgRed
  );
});
