import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';
import upload from "../config/multer.js";
import Post from '../models/post.js';


const router = express.Router();

// Configure Passport Strategy
passport.use(new LocalStrategy(User.authenticate()));

// Feed post api
router.post('/post', upload.array('images', 5), async (req, res) => {
  const { content } = req?.body;
  const user = await User.findOne({ username: req?.session?.passport?.user });
  // console.log("user --> ",user);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  let imageUrl = null;
  if (req?.file) {
    imageUrl = req?.file?.path;
  }
 // saving post
  const post = new Post({ 
    content,
    user: user?._id 
  });

  if (req?.files) {
    req?.files?.forEach(file => {
      post.images.push(file?.path);
    });
  }
  await post.save();
  // saving post id into user model
  user.posts.push(post?._id);
  // updating posts count
  user.postsCount = user.posts.length;
  await user.save();
  // populating post
  const populatedPost = await post?.populate('user');
  res.status(200).json(populatedPost);
  // console.log("post from feed js --> ", populatedPost);
});

// Feed interaction api
router.put('/post/:postId', async (req, res) => {
  const { postId } = req?.params;
  const { interactionType } = req?.body;
  const user = await User.findOne({ username: req?.session?.passport?.user });
  const post = await Post.findById(postId);

  if (!post) return res.status(404).json({ message: 'Post not found' });

  const interactions = {
    like: {
      flag: 'isLiked',
      userArray: 'likedPosts',
      postArray: 'likedBy',
    },
    save: {
      flag: 'isSaved', 
      userArray: 'savedPosts',
      postArray: 'savedBy'
    },
    repost: {
      flag: 'isReposted',
      userArray: 'repostedPosts', 
      postArray: 'repostedBy',
    }
  };

  const interaction = interactions[interactionType];
  post[interaction.flag] = !post[interaction.flag];
  
  if (post[interaction.flag]) {
    post[interaction.postArray].push(user?._id);
    user[interaction.userArray].push(post?._id);
  } else {
    post[interaction.postArray].pull(user?._id);
    user[interaction.userArray].pull(post?._id);
  }

  await Promise.all([post.save(), user.save()]);
  const populatedPost = await post?.populate('user');
  res.status(200).json(populatedPost);
});

// Get all posts api for feed page
router.get('/posts', async (req, res) => {
  const posts = await Post.find().populate('user');
  // Shuffle the posts array using Fisher-Yates algorithm
  for (let i = posts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [posts[i], posts[j]] = [posts[j], posts[i]];
  }
  // console.log("posts from feed js --> ", posts);
  res.status(200).json(posts);
});

export default router;