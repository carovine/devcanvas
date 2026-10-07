import userModel from "../models/userModel.js";
import decrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const hashedPassword = await decrypt.hash(password, 10);


    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) {
      return res.status(500).json({ message: "Error registering user" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", user });


  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
};
