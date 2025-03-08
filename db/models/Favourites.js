import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    // Reference to the OAuth user (stored in User collection)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Reference to the post that was favorited
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Favorite ||
  mongoose.model("Favorite", FavoriteSchema);
