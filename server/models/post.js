import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  images: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isLiked: { type: Boolean, default: false },  // client-specific, usually handled on frontend
  isSaved: { type: Boolean, default: false },  // client-specific, usually handled on frontend
}, {
  timestamps: true  // includes createdAt and updatedAt
});

const Post = mongoose.model('Post', postSchema);
export default Post;
