import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';
import upload from "../config/multer.js";
import Confession from '../models/confessions.js';


const router = express.Router();

// Configure Passport Strategy
passport.use(new LocalStrategy(User.authenticate()));

// Get anonymous ID
router.get('/anonymous-id', async (req, res) => {
    try {
      if (!req?.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = await User.findOne({username: req?.session?.passport?.user});
      
      // If user doesn't have an anonymous ID, create one
      if (!user.anonymousID) {
        const adjectives = ["Chill", "Brave", "Sneaky", "Clever", "Swift", "Silent", "Fierce", "Calm"];
        const animals = ["Fox", "Wolf", "Tiger", "Panda", "Hawk", "Koala", "Otter", "Raven"];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const number = Math.floor(10 + Math.random() * 90);
        const anonymousID = `${adj}${animal}${number}`;
        
        user.anonymousID = anonymousID;
        await user.save();
      }
      
      res.json({ anonymousID: user?.anonymousID });
    } catch (error) {
      console.error('Error getting anonymous ID:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Post confession
  router.post('/post', upload.array('images', 5), async (req, res) => {
    const { content } = req?.body;
    const user = await User.findOne({username: req?.session?.passport?.user});
    
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const confession = new Confession({ 
      content,
      user: user?._id,
      anonymousID: user?.anonymousID
    });

    if (req?.files) {
      req?.files?.forEach(file => {
        confession.images.push(file?.path);
      });
    }
    await confession.save();
    // saving post id into user model
    user.confessionPosts.push(confession?._id);
    // updating posts count 
    user.postsCount = user.posts.length;
    await user.save();
    // populating post
    const populatedConfession = await confession.populate('user');
    res.status(200).json(populatedConfession);
  });

  // Get all confessions
  router.get('/all-posts', async (req, res) => {
    try {
      const confessions = await Confession.find().populate('user').lean();
  
      const now = new Date().getTime();
      const shuffledConfessions = confessions
        .map(confession => {
          const ageInMinutes = (now - new Date(confession.createdAt).getTime()) / (1000 * 60);
          const score = Math.random() * Math.exp(-ageInMinutes / 60); // Decay factor: ~1hr
          return { confession, score };
        })
        .sort((a, b) => b.score - a.score)
        .map(item => item.confession);
  
      res.status(200).json(shuffledConfessions);
    } catch (err) {
      console.error("Error in /all-posts:", err);
      res.status(500).json({ error: "Failed to fetch confessions" });
    }
  });
  
  // Interact with a confession (like, repost, save)
  router.put('/post/:confessionId', async (req, res) => {
    const { confessionId } = req?.params;
    const { interactionType } = req?.body;
    const user = await User.findOne({ username: req?.session?.passport?.user });
    const confession = await Confession.findById(confessionId);

    if (!confession) return res.status(404).json({ message: 'Confession not found' });

    const interactions = {
      like: {
        flag: 'isLiked',
        userArray: 'likedPosts',
        confessionArray: 'likedBy',
      },
      save: {
        flag: 'isSaved',
        userArray: 'savedPosts', 
        confessionArray: 'savedBy'
      },
      repost: {
        flag: 'isReposted',
        userArray: 'repostedPosts',
        confessionArray: 'repostedBy',
      }
    };

    const interaction = interactions[interactionType];
    confession[interaction.flag] = !confession[interaction.flag];
    
    if (confession[interaction.flag]) {
      confession[interaction.confessionArray].push(user._id);
      user[interaction.userArray].push(confession._id);
    } else {
      confession[interaction.confessionArray].pull(user._id);
      user[interaction.userArray].pull(confession._id);
    }

    await Promise.all([confession.save(), user.save()]);
    const populatedConfession = await confession.populate('user');
    res.status(200).json(populatedConfession);
  });

  // Get all confessions for signed user
  router.get('/my-posts', async (req, res) => {
    const user = await User.findOne({username : req?.session?.passport?.user});
    
    const confessions = await Confession.find({ user: user?._id }).populate('user');
    // console.log("confessions from confessions js --> ", confessions);

    res.status(200).json(confessions)
  });

  // Update a confession
router.put("/my-posts/:postId", async (req, res) => {
  try {
    if (!req?.session?.passport?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { postId } = req?.params;
    const { content } = req?.body;
    console.log("content->>", content)
    
    const updatedPost = await Confession.findOneAndUpdate(
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
    res.status(500).json({ message: error?.message || 'Error updating post' });
  }
});

// Delete a confession
router.delete("/my-posts/:postId", async (req, res) => {
  try {
    if (!req?.session?.passport?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.find({username : req?.session?.passport?.user })
    const { postId } = req?.params;
    const deletedPost = await Confession.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Post deletion error:', error);
    res.status(500).json({ message: error?.message || 'Error deleting post' });
  }
});

  
  export default router;