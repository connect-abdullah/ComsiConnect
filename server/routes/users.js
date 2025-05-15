import express, { request } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';
import Post from '../models/post.js';
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
    if (!user) return res.status(401).json({ message: info?.message || 'Invalid email or password' });

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


// Profile Routes
// Get user profile
router.get('/profile', async (req, res) => {
  const user = await User.findOne({ username: req?.session?.passport?.user }).select('-password');

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
      { username: req?.session?.passport?.user }, 
      req?.body, 
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (req?.file) {
      user.avatar = req?.file?.path;
      await user.save();
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: error.message || 'Error updating profile' });
  }
});

// Get all posts for signed user
router.get('/posts', async (req, res) => {
  const user = await User.findOne({ username: req?.session?.passport?.user });
  const posts = await Post.find({ user: user?._id }).populate('user');
  const savedPosts = await Post.find({ _id: { $in: user.savedPosts } }).populate('user');
  // console.log("posts --> ", savedPosts)
  res.status(200).json({posts, savedPosts});
});

// Update a post
router.put("/posts/:postId", async (req, res) => {
  try {
    if (!req?.session?.passport?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { postId } = req?.params;
    const { content } = req?.body;
    console.log("content->>", content)
    
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { content },
      { new: true }
    ).populate('user');

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log("updatedPost --> ", updatedPost);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Post update error:', error);
    res.status(500).json({ message: error.message || 'Error updating post' });
  }
});

// Delete a post
router.delete("/posts/:postId", async (req, res) => {
  try {
    if (!req?.session?.passport?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.find({username : req?.session?.passport?.user })
    const { postId } = req?.params;
    const deletedPost = await Post.findByIdAndDelete(postId);

    user[0].posts.pull(postId);
    user[0].postsCount = user[0].posts.length;
    await user[0].save();

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Post deletion error:', error);
    res.status(500).json({ message: error.message || 'Error deleting post' });
  }
});

// Get other user profile 
router.get('/view-profile/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select('-password');
  const posts = await Post.find({ user: id }).populate('user');
  res.status(200).json({user, posts});
});

// Get followers list
router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select('-password');
  await user.populate(['followers', 'following']);
  res.status(200).json({user});
});


export default router;
