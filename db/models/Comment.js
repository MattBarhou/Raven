import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    // Reference to the post being commented on
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    // Reference to the user making the comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The comment text
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
