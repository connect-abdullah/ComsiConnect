import express, { request } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Configure Passport Strategy
passport.use(new LocalStrategy(User.authenticate()));

// Register route
router.post("/signup", async (req, res) => {
  const { fullName, password, email, username } = req.body;
  try {
    const user = new User({ 
      fullName, 
      email, 
      username,
      rollNumber: username 
    });
    
    console.log("User --> ", user);
    await User.register(user, password);
    res
      .status(200).json({ message: "Account created successfully! Please log in." });
  } catch (err) {
    console.log("Error --> ", err)  
    res.status(500).send(err.message);
  }
});

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(401)
        .json({ message: info?.message || "Invalid email or password" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      // Return user info and optionally a token (if you decide to implement JWT later)
      return res.status(200).json({ user });
    });
  })(req, res, next);
});

// Logout route
router.get("/logout", async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logged out successfully" });
  });
});

router.post("/forgot", async (req, res) => {
  const {email} = req?.body
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: user.email,
    from: `"ComsiConnect Support" <${process.env.GMAIL_USER}>`,
    subject: "Password Reset OTP - ComsiConnect",
    html: `
      <div style="background-color: #f6f6f6; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Password Reset Request</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            You have requested to reset your password. Please use the following OTP code to complete your password reset:
          </p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h2 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h2>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This OTP will expire in 5 minutes. If you did not request this password reset, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message from ComsiConnect. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  });

  res.status(200).send({ email: user.email, error: null})
});

router.post('/verify-otp', async (req,res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email,
      otp, 
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired OTP" });
    }

    await user.setPassword(newPassword); // from passport-local-mongoose
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({message : "Password is Successfully Changed"});

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: "An error occurred while verifying OTP" });
  }
})


export default router;
