import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    // Reference to the OAuth user (stored in User collection)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    files: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Enable virtuals when converting to JSON
    toObject: { virtuals: true }, // Enable virtuals when converting to object
  }
);

// Virtual for comments - this doesn't store comments in the post document
// but allows us to populate them when needed
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
