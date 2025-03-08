import { auth } from "@/authentication/auth";
import connectToDB from "@/db/dbConnect";
import Post from "@/db/models/Post";
import HomeDashboard from "@/components/HomeDashboard";
import User from "@/db/models/User";

async function getPosts() {
  await connectToDB();

  const posts = await Post.find()
    .populate({
      path: "user",
      model: User,
      select: "name email image",
    })
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(posts));
}

export default async function Home() {
  const session = await auth();
  const posts = await getPosts();

  return <HomeDashboard initialPosts={posts} session={session} />;
}
