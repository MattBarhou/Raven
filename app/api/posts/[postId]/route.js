import { NextResponse } from "next/server";
import connectToDB from "@/db/dbConnect";
import Post from "@/db/models/Post";
import { auth } from "@/authentication/auth";

// DELETE a specific post
export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the current user is the post author
    if (post.user.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this post" },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(postId);

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Post deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
