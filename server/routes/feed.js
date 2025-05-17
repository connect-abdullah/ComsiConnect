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
  post[interaction?.flag] = !post[interaction?.flag];
  
  if (post[interaction?.flag]) {
    post[interaction?.postArray].push(user?._id);
    user[interaction?.userArray].push(post?._id);
  } else {
    post[interaction?.postArray].pull(user?._id);
    user[interaction?.userArray].pull(post?._id);
  }

  await Promise.all([post.save(), user.save()]);
  const populatedPost = await post?.populate('user');
  res.status(200).json(populatedPost);
});

// Get all posts api for feed page
router.get('/posts', async (req, res) => {
  try {
    const currentUser = await User.findOne({ username: req.session.passport.user });
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized' });

    // All Posts
    let posts = await Post.find()
      .populate('user')
      .populate('repostedBy')
      .lean(); 

      // Following Posts
    let followingPosts = await Post.find({
      user: { $in: currentUser.following }
    }).populate('user').lean();

    // Add isFollowed flag to following posts
    followingPosts = followingPosts.map(post => {
      const isFollowed = post.user?.followers?.some(followerId =>
        followerId.toString() === currentUser._id.toString()
      );

      return {
        ...post,
        user: {
          ...post.user,
          isFollowed
        }
      };
    });

    // Add isFollowed to each post.user
    posts = posts.map(post => {
      const isFollowed = post.user?.followers?.some(followerId =>
        followerId.toString() === currentUser._id.toString()
      );

      return {
        ...post,
        user: {
          ...post.user,
          isFollowed
        }
      };
    });


      // Weighted shuffle: favor newer posts but allow randomness
      const now = new Date().getTime();
      posts = posts
        .map(post => {
          const ageInMinutes = (now - new Date(post.createdAt).getTime()) / (1000 * 60);
          const score = Math.random() * Math.exp(-ageInMinutes / 60); // decays over ~1hr
          return { post, score };
        })
        .sort((a, b) => b.score - a.score)
        .map(p => p.post);

    res.status(200).json({posts, followingPosts});
  } catch (err) {
    console.error("Error in /posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});



// Follow User 
router.post('/follow/:userId', async (req,res) => {
  try {
    const {userId} = req?.params;
  const {action} = req?.body;
  const user = await User.findOne({username : req?.session?.passport?.user});
  const userToFollow = await User.findById(userId);
 console.log("action --> ",action)
 
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!userId) return res.status(404).json({ message: 'User not found' });
  // Only check for already followed if action is "follow"
  // if (action === "follow" && userToFollow.followers.includes(user._id)) {
  //   return res.status(409).json({message: "Already Followed",
  //     isFollowed: false})
  // }
  
if (action === "follow") {
  user.following.push(userToFollow._id);
  userToFollow.followers.push(user._id);
  user.followingCount = user.following.length;
  userToFollow.followersCount = userToFollow.followers.length;
  await Promise.all([user.save(), userToFollow.save()]);
  const isFollowed = userToFollow.followers.includes(user._id)
  console.log("isFollowed Testing -->", isFollowed)
  res.status(201).json({
    message: "Successfully Followed The User",
    isFollowed
  })
} else if (action === "unfollow") {
  user.following.pull(userToFollow._id);
  userToFollow.followers.pull(user._id);
  user.followingCount = user.following.length;
  userToFollow.followersCount = userToFollow.followers.length;
  await Promise.all([user.save(), userToFollow.save()]);
  const isFollowed = userToFollow.followers.includes(user._id)
  res.status(200).json({message: "Successfully unfollowed The User",
    isFollowed})
}


  } catch (err) {
    res.status(500).json({
      message: "Error in Following The User"
    })
  }
})

export default router;