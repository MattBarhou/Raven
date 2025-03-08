"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegShareSquare,
} from "react-icons/fa";
import CommentModal from "./CommentModal";
import { useSession } from "next-auth/react";

const PostCard = ({ post }) => {
  const { data: session } = useSession();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [userHasLiked, setUserHasLiked] = useState(post.userHasLiked || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Fetch likes when component mounts
  useEffect(() => {
    fetchLikes();
  }, []);

  // Function to fetch likes
  const fetchLikes = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/likes`);
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.count);
        setUserHasLiked(data.userHasLiked);
      }
    } catch (error) {
      console.error("Failed to fetch likes:", error);
    }
  };

  // Function to handle like button click
  const handleLikeClick = async () => {
    if (!session) return; // Don't allow likes if not logged in
    if (isLikeLoading) return; // Prevent multiple clicks

    try {
      setIsLikeLoading(true);
      const response = await fetch(`/api/posts/${post._id}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.count);
        setUserHasLiked(data.userHasLiked);
      }
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  // Function to handle comment button click
  const handleCommentClick = () => {
    setIsCommentModalOpen(true);
  };

  // Function to handle when a new comment is added
  const handleCommentAdded = () => {
    setCommentCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
      <div className="card-body">
        {/* Header: User Info and Timestamp */}
        <div className="flex items-start space-x-3">
          {/* User Avatar */}
          <div className="avatar">
            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <Image
                src={post.user.image || "/default-avatar.png"}
                alt={post.user.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
          </div>

          {/* User Details and Timestamp */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold mt-2 text-lg">{post.user.name}</h3>
              </div>
              <span className="text-sm opacity-70">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-4 prose">
          <p className="whitespace-pre-wrap">{post.text}</p>
        </div>

        {/* Post Images/Files */}
        {post.files && post.files.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {post.files.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-box overflow-hidden"
              >
                <Image
                  src={file.url}
                  alt={`Attachment ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-start space-x-4 mt-4 card-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleLikeClick}
            disabled={isLikeLoading}
          >
            {userHasLiked ? (
              <FaHeart className="w-5 h-5 text-red-500" />
            ) : (
              <FaRegHeart className="w-5 h-5" />
            )}
            <span className="ml-1">
              {userHasLiked ? "Liked" : "Like"}{" "}
              {likeCount > 0 && `(${likeCount})`}
            </span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleCommentClick}>
            <FaRegComment className="w-5 h-5" />
            <span className="ml-1">
              Comment {commentCount > 0 && `(${commentCount})`}
            </span>
          </button>
          <button className="btn btn-ghost btn-sm">
            <FaRegShareSquare className="w-5 h-5" />
            <span className="ml-1">Share</span>
          </button>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postId={post._id}
        session={session}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
};

export default PostCard;
