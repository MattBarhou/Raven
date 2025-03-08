"use client";

import { useState, useEffect } from "react";
import SideNavbar from "./SideNavbar";
import PostCard from "./PostCard";

export default function HomeDashboard({ initialPosts, session }) {
  const [posts, setPosts] = useState(initialPosts);

  // Function to refresh posts
  const refreshPosts = async () => {
    try {
      console.log("Refreshing posts...");
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        console.log("Refreshed posts data:", data);
        setPosts(data);
      } else {
        console.error("Failed to refresh posts:", await response.text());
      }
    } catch (error) {
      console.error("Failed to refresh posts:", error);
    }
  };

  // Listen for custom event to refresh posts
  useEffect(() => {
    const handleNewPost = () => refreshPosts();
    window.addEventListener("new-post-created", handleNewPost);

    return () => {
      window.removeEventListener("new-post-created", handleNewPost);
    };
  }, []);

  if (!session) {
    return <p>Not signed in</p>;
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      <SideNavbar refreshPosts={refreshPosts} />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => {
                return (
                  <PostCard
                    key={post._id}
                    post={{
                      ...post,
                      commentCount: post.commentCount || 0,
                      likeCount: post.likeCount || 0,
                      userHasLiked: post.userHasLiked || false,
                    }}
                  />
                );
              })
            ) : (
              <div className="text-center p-8 bg-base-100 rounded-box shadow">
                <p className="text-lg">No posts yet. Be the first to post!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
