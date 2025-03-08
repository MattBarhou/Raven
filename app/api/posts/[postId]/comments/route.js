import { NextResponse } from "next/server";
import { auth } from "@/authentication/auth";
import connectToDB from "@/db/dbConnect";
import Post from "@/db/models/Post";
import Comment from "@/db/models/Comment";
import User from "@/db/models/User";

// GET comments for a specific post
export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { postId } = await params;

    const comments = await Comment.find({ post: postId })
      .populate({
        path: "user",
        model: User,
        select: "name email image",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST a new comment
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectToDB();
    const { postId } = params;
    const { text } = await request.json();

    // Verify the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create the comment
    const comment = await Comment.create({
      post: postId,
      user: session.user.id,
      text,
    });

    // Populate user data
    const populatedComment = await Comment.findById(comment._id).populate({
      path: "user",
      model: User,
      select: "name email image",
    });

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
