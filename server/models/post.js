import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  images: [{ type: String }],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  repostedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isLiked: { type: Boolean, default: false },  // client-specific
  isSaved: { type: Boolean, default: false },  // client-specific
  isReposted: { type: Boolean, default: false },  // client-specific
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,  // includes createdAt and updatedAt
});

const Post = mongoose.model('Post', postSchema);
export default Post;
