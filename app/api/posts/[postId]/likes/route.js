import { NextResponse } from "next/server";
import { auth } from "@/authentication/auth";
import connectToDB from "@/db/dbConnect";
import Post from "@/db/models/Post";
import Like from "@/db/models/Like";

// GET likes for a specific post
export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { postId } = await params;

    // Count total likes
    const likeCount = await Like.countDocuments({ post: postId });

    // Check if current user has liked the post
    const session = await auth();
    let userHasLiked = false;

    if (session && session.user && session.user.id) {
      const userLike = await Like.findOne({
        post: postId,
        user: session.user.id,
      });
      userHasLiked = !!userLike;
    } else {
      console.log("No authenticated user for like check");
    }

    return NextResponse.json({
      count: likeCount,
      userHasLiked,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes", details: error.message },
      { status: 500 }
    );
  }
}

// POST to like/unlike a post
export async function POST(request, { params }) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectToDB();
    const { postId } = await params;

    // Verify the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({
      post: postId,
      user: session.user.id,
    });

    // If like exists, remove it (unlike)
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      // Get updated count
      const updatedCount = await Like.countDocuments({ post: postId });

      return NextResponse.json({
        count: updatedCount,
        userHasLiked: false,
        message: "Post unliked successfully",
      });
    }
    // Otherwise, create a new like
    else {
      const newLike = await Like.create({
        post: postId,
        user: session.user.id,
      });

      // Get updated count
      const updatedCount = await Like.countDocuments({ post: postId });

      return NextResponse.json({
        count: updatedCount,
        userHasLiked: true,
        message: "Post liked successfully",
      });
    }
  } catch (error) {
    // Handle duplicate key error (if user tries to like twice)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You have already liked this post" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to like/unlike post", details: error.message },
      { status: 500 }
    );
  }
}
