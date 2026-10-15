import userModel from "../models/userModel.js";
import decrypt from "bcryptjs";
import transporter from "../config/nodemailer.js";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";
import mongoose from "mongoose";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const hashedPassword = await decrypt.hash(password, 10);

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "Error registering user" });
    }

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // sending welcome email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Welcome to devCanvas",
      text: "Welcome to devCanvas! You have successfully registered.",
      html: "<b>Welcome to devCanvas!</b>",
    });

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await decrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true, message: "User Logged in Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true, message: "User Logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// send otp to email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "error finding user" });
    }
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "account already verified" });
    }

    const otp = String(randomInt(100000, 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await user.save();

    // Send OTP email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Verify your account",
      text: `Your OTP for account verification is: ${otp}`,
      html: `<p>Your OTP for account verification is: <b>${otp}</b> It is valid for 10 minutes</p>`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// verify email using otp
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { userId } = req.user;
    if (!userId || !otp) {
      return res.json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    if (user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpire < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpire = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// send password reset otp

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "user invalid" });
    }

    const otp = String(randomInt(100000, 900000));

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await user.save();
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Reset Account Password",
      text: `Your OTP for account verification is: ${otp}`,
      html: `<p>Your OTP for Reset Account Password is: <b>${otp}</b> It is valid for 10 minutes</p>`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// verfy reset password otp

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpire < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }

    const hashedPassword = await decrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpire = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
