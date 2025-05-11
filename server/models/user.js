import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    avatar: { type: String, default: 'FA' },
    bio: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    department: { type: String },
    yearOfStudy: { type: String },
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    repostedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    anonymousID: { type: String, unique: true },
    confessionPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Confession' }]
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose); // adds username, hash, salt + helper methods

const User = mongoose.model('User', userSchema);
export default User;
