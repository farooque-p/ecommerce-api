import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

//User Authentication
export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  //Validation
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised User!",
    });
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decodedData);
  req.user = await User.findById(decodedData._id);
  next();
};

//Admin Authentication
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "Admin Only",
    });
  }
  next();
};
