import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

const CommentModal = ({ isOpen, onClose, postId, session, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // Fetch comments when modal opens
  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentText("");
        if (onCommentAdded) onCommentAdded();
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-box p-6 w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Comments</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={session?.user?.image || "/default-avatar.png"}
                  alt={session?.user?.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isLoading || !commentText.trim()}
            >
              {isLoading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="overflow-y-auto flex-1">
          {isLoadingComments ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner"></span>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-2">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <Image
                        src={comment.user.image || "/default-avatar.png"}
                        alt={comment.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 bg-base-200 p-3 rounded-box">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold">{comment.user.name}</span>
                      <span className="text-xs opacity-70">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm opacity-70 p-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
