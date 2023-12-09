import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already taken!"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password length should be greater then 6 character"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City name is required"],
    },
    country: {
      type: String,
      required: [true, "Country name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    answer: {
      type: String,
      required: [true, "Answer is required."],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

//Password Hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare/Decrypt Password
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// JWT Token
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

export const User = mongoose.model("Users", userSchema);
