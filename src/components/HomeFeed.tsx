import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Image, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  MoreHorizontal,
  MapPin,
  Flame,
  Users,
  Repeat
} from 'lucide-react';
import { Post, Story, CurrentUser, UserProfile } from '../types';
import { playPopSound } from '../utils/audio';

interface HomeFeedProps {
  currentUser: CurrentUser;
  stories: Story[];
  posts: Post[];
  onOpenStory: (storyIndex: number) => void;
  onOpenChat: (userId: string) => void;
  onViewProfile: (profile: UserProfile) => void;
  onLikePost: (postId: string) => void;
  onCreatePost: (content: string, imageUrl?: string) => void;
  onNavigateToCommunities: () => void;
  onRequireSubscription?: (message?: string) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  currentUser,
  stories,
  posts,
  onOpenStory,
  onOpenChat,
  onViewProfile,
  onLikePost,
  onCreatePost,
  onNavigateToCommunities,
  onRequireSubscription,
}) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    if (!currentUser.isSubscribed) {
      if (onRequireSubscription) {
        onRequireSubscription(
          'Free Preview Mode: Browsing the feed is free! To publish posts and share updates with the community, subscribe to VIP.'
        );
        return;
      }
    }
    playPopSound();
    onCreatePost(newPostContent.trim(), newPostImageUrl.trim() || undefined);
    setNewPostContent('');
    setNewPostImageUrl('');
    setShowImageInput(false);
  };

  const handleToggleBookmark = (postId: string) => {
    playPopSound();
    setSavedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    playPopSound();
    // find post and append comment
    const post = posts.find((p) => p.id === postId);
    if (post) {
      if (!post.comments) post.comments = [];
      post.comments.push({
        id: `c-${Date.now()}`,
        author: currentUser,
        content: text.trim(),
        createdAt: 'Just now',
        likesCount: 0,
      });
      post.commentsCount += 1;
    }
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5">
      {/* 24-HOUR STORIES BAR (PRD §16) */}
      <section className="bg-[#0e0e13] border border-red-950/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {/* User's Own Story Button */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.nickname}
                className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700 group-hover:border-red-500 transition-colors"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-black">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-zinc-300">Your Story</span>
          </div>

          {/* Stories List from Friends & Matches */}
          {stories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => onOpenStory(idx)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 animate-pulse group-hover:scale-105 transition-transform">
                <img
                  src={story.author.avatarUrl}
                  alt={story.author.nickname}
                  className="w-13 h-13 rounded-full object-cover border-2 border-black"
                />
              </div>
              <span className="text-[11px] font-medium text-zinc-200 truncate max-w-[64px]">
                {story.author.nickname}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CREATE POST INPUT BOX (PRD §15) */}
      <section className="bg-[#0e0e13] border border-red-950/80 rounded-2xl sm:rounded-3xl p-4 shadow-xl text-left space-y-3">
        <div className="flex items-start gap-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.nickname}
            className="w-10 h-10 rounded-full object-cover border border-red-500/50"
          />
          <div className="flex-1 space-y-2">
            <textarea
              rows={2}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={`Share an update, idea or photo with MIZIZI, ${currentUser.nickname}...`}
              className="w-full bg-[#14141c] text-white placeholder-zinc-500 rounded-2xl p-3 text-xs sm:text-sm border border-red-950 focus:outline-none focus:border-red-500 resize-none"
            />

            {showImageInput && (
              <input
                type="text"
                value={newPostImageUrl}
                onChange={(e) => setNewPostImageUrl(e.target.value)}
                placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                className="w-full bg-[#14141c] text-white placeholder-zinc-500 rounded-xl px-3 py-2 text-xs border border-red-950 focus:outline-none focus:border-red-500"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-red-950/60 pt-2.5">
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-red-400 cursor-pointer"
          >
            <Image className="w-4 h-4 text-red-500" />
            <span>Add Photo / Media</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={!newPostContent.trim()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:opacity-40 text-white font-bold text-xs cursor-pointer shadow-lg shadow-red-950 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Post</span>
          </button>
        </div>
      </section>

      {/* FEED POSTS STREAM */}
      <div className="space-y-5">
        {posts.map((post) => {
          const isSaved = savedPostIds.includes(post.id);
          const commentsOpen = openCommentsPostId === post.id;
          const currentCommentText = commentInputs[post.id] || '';

          return (
            <article
              key={post.id}
              className="bg-[#0e0e13] border border-red-950/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl text-left"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div 
                  onClick={() => onViewProfile(post.author)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.nickname}
                    className="w-10 h-10 rounded-full object-cover border border-red-500/50 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-white group-hover:text-red-400 transition-colors">
                        {post.author.nickname}
                      </span>
                      {post.author.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-500 fill-red-950 inline" />
                      )}
                      {post.communityName && (
                        <span className="text-[10px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded border border-red-800">
                          in {post.communityName}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <span>{post.createdAt}</span>
                      {post.location && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-red-400">
                            <MapPin className="w-3 h-3" />
                            {post.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button className="text-zinc-500 hover:text-white p-1 rounded-full cursor-pointer">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Text Content */}
              <div className="px-4 pb-3">
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.tags.map((t) => (
                      <span key={t} className="text-[11px] text-red-400 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Media / Photos Carousel */}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="relative aspect-[16/10] bg-black overflow-hidden">
                  <img
                    src={post.mediaUrls[0]}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Post Engagement Bar */}
              <div className="p-3 sm:p-4 border-t border-red-950/60 flex items-center justify-between text-zinc-400 text-xs">
                <div className="flex items-center gap-4">
                  {/* Like Button */}
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 font-semibold cursor-pointer transition-colors ${
                      post.isLiked ? 'text-red-500' : 'hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{post.likesCount}</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => setOpenCommentsPostId(commentsOpen ? null : post.id)}
                    className="flex items-center gap-1.5 font-semibold hover:text-white cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.commentsCount}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => alert('Post link copied to clipboard!')}
                    className="flex items-center gap-1.5 font-semibold hover:text-white cursor-pointer"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>{post.sharesCount}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onOpenChat(post.author.id)}
                    className="text-[11px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Direct Chat</span>
                  </button>

                  <button
                    onClick={() => handleToggleBookmark(post.id)}
                    className={`cursor-pointer transition-colors ${
                      isSaved ? 'text-red-500' : 'hover:text-white'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expandable Comments Drawer */}
              {commentsOpen && (
                <div className="p-4 bg-[#111116] border-t border-red-950/60 space-y-3 animate-in fade-in">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((cm) => (
                        <div key={cm.id} className="bg-black/40 p-2.5 rounded-xl border border-red-950/40 text-xs flex items-start gap-2.5">
                          <img
                            src={cm.author.avatarUrl}
                            alt={cm.author.nickname}
                            className="w-7 h-7 rounded-full object-cover border border-red-950 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <span className="font-bold text-white mr-1.5">{cm.author.nickname}</span>
                            <span className="text-zinc-300">{cm.content}</span>
                            <span className="block text-[10px] text-zinc-500 mt-0.5">{cm.createdAt}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-500 italic">No comments yet. Start the conversation!</p>
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-2 border-t border-red-950/40">
                    <input
                      type="text"
                      value={currentCommentText}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      placeholder="Write a comment..."
                      className="flex-1 bg-black/60 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!currentCommentText.trim()}
                      className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs cursor-pointer"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
