import { User } from "../models/userModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

//User Registration
export const register = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, answer } =
      req.body;
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !answer
    ) {
      res
        .status(500)
        .send({ success: false, message: "All Fields are Mandatory!" });
    }

    //Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(500)
        .send({ success: false, message: "User Already Exists!" });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer,
    });

    res.status(200).send({
      success: true,
      message: "Registration Success! Please Login!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error in Register API!" });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res
        .status(500)
        .send({ success: false, message: "Email and Password are required." });
    }

    // Check User
    const user = await User.findOne({ email });

    if (!user) {
      res.status(500).send({ success: false, message: "User Not Found!" });
    }

    //Check Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(500)
        .send({ success: false, message: "Invalid User Name or Password" });
    }
    // Token
    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({ success: true, message: "Login Successful!", token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error in Login API!" });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "User Profile Fetched Successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error Fetching User Profile!", error });
  }
};

// User Logout
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .json({ success: true, message: "Logged Out Successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error While Logging Out!" });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // Validation + Update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    // Save User
    await user.save();
    res.status(200).json({
      success: true,
      message: "User Profile Updated Successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error While Updating User Profile!" });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;

    //Validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Both Old and New Password",
      });
    }

    //Check Old Password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res
        .status(500)
        .json({ success: false, message: "Incorrect Old Password!" });
    }

    // Set New Password
    user.password = newPassword;

    //Save User
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error While Updating Password!" });
  }
};

//Update Profile Picture
export const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    //Get File from Client
    const file = getDataUri(req.file);
    //Delete Previous Profile Picture
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    //Update Proifle Picture
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    //console.log("CDB", cdb);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    // Save User
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile Picture Updated Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Updating Profile Picture!",
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    //Get email, new password and answer
    const { email, newPassword, answer } = req.body;

    if (!email || !newPassword || !answer) {
      return res
        .status(500)
        .json({ success: false, message: "All Fields are Mandatory!" });
    }

    const user = await User.findOne({ email, answer });
    //Validaton
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid User or Answer!" });
    }

    //Set password
    user.password = newPassword;
    //Save user
    await user.save();
    res.status(200).json({
      success: true,
      message: "Your Password has been Reset Successfully! Please login.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error While Resetting Password!" });
  }
};
