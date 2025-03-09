import { NextResponse } from "next/server";
import connectToDB from "@/db/dbConnect";
import Post from "@/db/models/Post";
import User from "@/db/models/User";
import Comment from "@/db/models/Comment";
import { auth } from "@/authentication/auth";
import { uploadFileToS3 } from "@/utils/s3";

export async function GET() {
  try {
    await connectToDB();

    // Get all posts with user information
    const posts = await Post.find()
      .populate({
        path: "user",
        model: User,
        select: "name email image",
      })
      .sort({ createdAt: -1 });

    // Get comment counts for each post
    const postsWithCommentCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        const postObj = post.toObject();
        postObj.commentCount = commentCount;
        return postObj;
      })
    );

    return NextResponse.json(postsWithCommentCounts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const text = formData.get("text");
    const fileEntries = formData.getAll("files");

    // Handle file uploads
    const fileUrls = [];
    if (fileEntries && fileEntries.length > 0) {
      for (const file of fileEntries) {
        if (file instanceof File) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const url = await uploadFileToS3(buffer, file.name, file.type);
          fileUrls.push({ url });
        }
      }
    }

    const post = await Post.create({
      user: session.user.id,
      text: text,
      files: fileUrls,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "name email image"
    );

    return NextResponse.json(populatedPost);
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create post", details: error.message },
      { status: 500 }
    );
  }
}

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
