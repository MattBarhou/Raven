"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import CommentModal from "./CommentModal";
import { useSession } from "next-auth/react";
import ActionButtons from "./ActionButtons";
import { useRouter } from "next/navigation";

const PostCard = ({ post }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [userHasLiked, setUserHasLiked] = useState(post.userHasLiked || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is the post author
  const isAuthor = session?.user?.id === post.user._id;

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

  // Function to open delete confirmation modal
  const handleDeleteClick = () => {
    // Only allow post author to delete
    if (!isAuthor) return;
    setIsDeleteModalOpen(true);
  };

  // Function to confirm and execute post deletion
  const confirmDelete = async () => {
    // Double-check that user is the author before deleting
    if (!isAuthor) {
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Close the modal
        setIsDeleteModalOpen(false);

        // Dispatch a custom event to refresh posts instead of using router.refresh()
        const event = new Event("new-post-created");
        window.dispatchEvent(event);
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to delete post:",
          errorData.error || "Unknown error"
        );
        alert(`Error: ${errorData.error || "Failed to delete post"}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post");
    } finally {
      setIsDeleting(false);
    }
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
        <ActionButtons
          handleLikeClick={handleLikeClick}
          handleCommentClick={handleCommentClick}
          handleDeleteClick={handleDeleteClick}
          userHasLiked={userHasLiked}
          isLikeLoading={isLikeLoading}
          likeCount={likeCount}
          commentCount={commentCount}
          isAuthor={isAuthor}
        />

        {/* Comment Modal */}
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          postId={post._id}
          session={session}
          onCommentAdded={handleCommentAdded}
        />

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
