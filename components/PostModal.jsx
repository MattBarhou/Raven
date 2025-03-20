import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const PostModal = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [postText, setPostText] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Create preview URLs for selected files
    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setFilePreviewUrls(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("text", postText);

      // Add the current session user information
      if (session) {
        formData.append("userImage", session.user.image || "");
        formData.append("userName", session.user.name || "");
      }

      // Only append files if they exist
      if (files.length > 0) {
        for (const file of files) {
          formData.append("files", file);
        }
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create post");
      }

      // Clean up preview URLs
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));

      setPostText("");
      setFiles([]);
      setFilePreviewUrls([]);
      onClose();

      // Create a custom event to trigger post refresh instead of reloading the page
      const event = new Event("new-post-created");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box relative">
          {/* Close button */}
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
          <h3 className="text-lg font-bold">Create Post</h3>

          {/* Show current user info */}
          <div className="flex items-center gap-2 my-3">
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
            <span className="font-medium">{session?.user?.name}</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              placeholder="What's on your mind?"
              className="textarea textarea-bordered w-full mb-4"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              required
            ></textarea>

            {/* File Preview */}
            {filePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {filePreviewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-box overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full mb-4"
              accept="image/*"
            />

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostModal;
