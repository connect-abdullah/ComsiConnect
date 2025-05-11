import mongoose from 'mongoose';

const confessionSchema = new mongoose.Schema({
  anonymousID: { type: String, required: true },
  content: { type: String, default: '' },
  images: [{ type: String }],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  repostedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isLiked: { type: Boolean, default: false },  // client-specific
  isSaved: { type: Boolean, default: false },  // client-specific
  isReposted: { type: Boolean, default: false },  // client-specific
}, {
  timestamps: true  // includes createdAt and updatedAt
});

const Confession = mongoose.model('Confession', confessionSchema);
export default Confession;
