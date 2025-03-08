import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    // Reference to the post being liked
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    // Reference to the user who liked
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only like a post once
LikeSchema.index({ post: 1, user: 1 }, { unique: true });

// Check if the model exists before creating it
export default mongoose.models.Like || mongoose.model("Like", LikeSchema);
