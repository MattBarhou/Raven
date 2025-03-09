import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegShareSquare,
  FaTrash,
} from "react-icons/fa";

export default function ActionButtons({
  handleLikeClick,
  handleCommentClick,
  handleDeleteClick,
  userHasLiked,
  isLikeLoading,
  likeCount,
  commentCount,
  isAuthor,
}) {
  return (
    <>
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
        {isAuthor && (
          <button
            className="btn btn-ghost btn-sm text-error"
            onClick={handleDeleteClick}
          >
            <FaTrash className="w-5 h-5" />
            <span className="ml-1">Delete</span>
          </button>
        )}
      </div>
    </>
  );
}
