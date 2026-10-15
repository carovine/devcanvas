import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyOtp,
  isAuthenticated,
  sendResetOtp,
  verifyResetOtp,
} from "../controllers/authController.js";
import transporter from "../config/nodemailer.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/account-verify-otp", userAuth, verifyOtp);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/verify-reset-otp", verifyResetOtp);

authRouter.get("/check-email", async (req, res) => {
  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Verification failed:", err);
  }
});

export default authRouter;
