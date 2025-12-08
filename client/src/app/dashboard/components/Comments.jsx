import React, { useState , useEffect } from "react";
import { CornerDownRight, Send } from "lucide-react";
import Image from "next/image";
import { usePost } from "@/context/PostContext";

// Comment Item Component
const CommentItem = ({
  comment,
  user,
  postId,
  onReply,
  onLike,
  onViewReplies,
  replies,
  loadingReplies,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await onLike(comment._id);
    } catch (error) {
      // Revert
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (!newIsLiked ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleSubmitReply = async () => {
    if (replyText.trim()) {
      await onReply(comment._id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const getTimeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
  };

  const author = comment.author || comment.authorId || {};
  const authorName =
    author.fullName ||
    `${author.firstName || ""} ${author.lastName || ""}`.trim() ||
    "Unknown User";
  const authorImage =
    author.profilePicture ||
    author.profileImage ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";
  const authorHeadline = author.headline || "";

  return (
    <div className="flex gap-3">
      <Image
        width={32}
        height={32}
        src={authorImage}
        alt={authorName}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-2 inline-block min-w-[200px]">
          <div className="flex items-center justify-between mb-1 gap-4">
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
              {authorName}
            </h4>
            <span className="text-xs text-neutral-500">
              {getTimeSince(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1">
            {authorHeadline}
          </p>
          <p className="text-sm text-neutral-900 dark:text-white mt-1">
            {comment.content}
          </p>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-4 mt-1 ml-2">
          <button
            onClick={handleLike}
            className={`text-xs font-medium flex items-center gap-1 ${
              isLiked
                ? "text-purple-600"
                : "text-neutral-600 dark:text-neutral-400 hover:text-purple-600"
            }`}
          >
            {likesCount > 0 && <span>{likesCount}</span>}
            Like
          </button>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-purple-600"
          >
            Reply
          </button>
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitReply()}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-1 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full focus:outline-none focus:border-purple-500"
              autoFocus
            />
            <button
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
              className="p-1 text-purple-600 hover:bg-purple-50 rounded-full disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View Replies */}
        {comment.repliesCount > 0 && (
          <div className="mt-2">
            {!replies ? (
              <button
                onClick={() => onViewReplies(comment._id)}
                className="text-xs font-medium text-purple-600 flex items-center gap-1 hover:underline"
              >
                <CornerDownRight className="w-3 h-3" />
                {loadingReplies
                  ? "Loading..."
                  : `View ${comment.repliesCount} replies`}
              </button>
            ) : (
              <div className="space-y-3 mt-2 pl-4 border-l-2 border-neutral-200 dark:border-neutral-800">
                {replies.map((reply) => (
                  <CommentItem
                    key={reply._id}
                    comment={reply}
                    user={user}
                    postId={postId}
                    onReply={onReply}
                    onLike={onLike}
                    onViewReplies={onViewReplies}
                    // Nested replies not supported in UI for now to prevent infinite recursion depth issues
                    replies={null}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Comments = ({ post, user, showInput, onInputToggle }) => {
  const { addComment, getComments, likeComment } = usePost();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [replies, setReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(
    (post.commentsCount || 0) > (post.comments?.length || 0)
  );
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    setComments(post.comments || []);
    setHasMoreComments(
      (post.commentsCount || 0) > (post.comments?.length || 0)
    );
  }, [post.comments, post.commentsCount]);

  // Comment Handlers
  const handleAddComment = async (parentId = null, text = commentText) => {
    if (text.trim()) {
      try {
        const newComment = await addComment(post._id, text, parentId);

        if (parentId) {
          // Add to replies
          setReplies((prev) => ({
            ...prev,
            [parentId]: [newComment, ...(prev[parentId] || [])],
          }));
        } else {
          // Add to top-level comments
          setComments([newComment, ...comments]);
          setCommentText("");
          if (onInputToggle) onInputToggle(false);
        }
      } catch (error) {
        console.error("Failed to add comment", error);
      }
    }
  };

  const handleLoadMoreComments = async () => {
    if (loadingComments) return;
    setLoadingComments(true);
    try {
      // If we have comments, we assume we want the next page.
      // If comments is empty, start at page 1.
      const nextPage = comments.length === 0 ? 1 : commentPage + 1;

      const response = await getComments(post._id, nextPage);
      if (response && response.data) {
        // Filter out duplicates to be safe
        const newComments = response.data.filter(
          (newC) => !comments.some((existingC) => existingC._id === newC._id)
        );

        setComments((prev) => [...prev, ...newComments]);
        setCommentPage(nextPage);
        setHasMoreComments(
          comments.length + newComments.length < response.pagination.total
        );
      }
    } catch (error) {
      console.error("Failed to load more comments", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleViewReplies = async (commentId) => {
    if (replies[commentId]) return; // Already loaded

    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
    try {
      const response = await getComments(post._id, 1, commentId);
      if (response && response.data) {
        setReplies((prev) => ({
          ...prev,
          [commentId]: response.data,
        }));
      }
    } catch (error) {
      console.error("Failed to load replies", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <>
      {/* Comment Input */}
      {showInput && (
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex gap-3">
            <Image
              width={100}
              height={100}
              src={
                user.profilePicture ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
              }
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <button
                onClick={() => handleAddComment()}
                disabled={!commentText.trim()}
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {comments.length > 0 && (
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id || comment.id}
              comment={comment}
              user={user}
              postId={post._id}
              onReply={(parentId, text) => handleAddComment(parentId, text)}
              onLike={likeComment}
              onViewReplies={handleViewReplies}
              replies={replies[comment._id]}
              loadingReplies={loadingReplies[comment._id]}
            />
          ))}

          {hasMoreComments && (
            <button
              onClick={handleLoadMoreComments}
              disabled={loadingComments}
              className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline w-full text-center py-2"
            >
              {loadingComments ? "Loading..." : "Load more comments"}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Comments;
