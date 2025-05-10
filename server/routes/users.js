import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';
import upload from "../config/multer.js";


const router = express.Router();

// Configure Passport Strategy
passport.use(new LocalStrategy(User.authenticate()));

// Register route
router.post('/signup', async (req, res) => {
  const { fullName, password, email, username } = req.body;
  try {
    const user = new User({ fullName, email, username });
    await User.register(user, password);
    res.status(200).json({ message: 'Account created successfully! Please log in.' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login route
router.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message || 'Invalid email or password' });

    req.logIn(user, (err) => {
      if (err) return next(err);
      // Return user info and optionally a token (if you decide to implement JWT later)
      return res.status(200).json({ user });
    });
  })(req, res, next);
});

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Get user profile
router.get('/profile', async (req, res) => {
  const user = await User.findOne({ username: req.session.passport.user }).select('-password');

  if (!req.session?.passport?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.status(200).json(user);
});

// Update user profile
router.put('/profile/edit', upload.single('file'), async (req, res) => {
  try {
    if (!req.session?.passport?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await User.findOneAndUpdate(
      { username: req.session.passport.user }, 
      req.body, 
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (req.file) {
      user.avatar = req.file.path;
      await user.save();
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: error.message || 'Error updating profile' });
  }
});



export default router;
