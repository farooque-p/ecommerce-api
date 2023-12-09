import express from "express";
import cors from "cors";
import morgan from "morgan";
import User from "./routes/userRoutes.js";
import Product from "./routes/productRoutes.js";
import Category from "./routes/categoryRoutes.js";
import Order from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

//Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());

//Routes
app.use("/api/v1/user", User);
app.use("/api/v1/product", Product);
app.use("/api/v1/category", Category);
app.use("/api/v1/order", Order);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Welcome To Node server </h1>");
});

export default app;
