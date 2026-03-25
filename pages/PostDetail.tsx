import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostInsights } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import ClaimRewardModal from '../components/ClaimRewardModal';
import LimitReachedModal from '../components/LimitReachedModal';
import AdsterraNativeBanner from '../components/AdsterraNativeBanner';
import {
  Clock,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Trophy,
  Info,
  CheckCircle2,
} from 'lucide-react';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, stats, posts, addReward, submitCommentWithReward, setLimitModalShown, systemPlans, viewPost } = useAuth();
  const [insight, setInsight] = useState<string | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [rewardModal, setRewardModal] = useState<{ show: boolean; type: 'reading' | 'comment' }>({ show: false, type: 'reading' });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState<string | undefined>(undefined);
  const [commentText, setCommentText] = useState('');
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  // Use a ref to prevent double counting in strict mode
  const hasViewedRef = useRef(false);

  const post = posts.find((p) => p.slug === slug);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeChapter = post?.chapters[activeChapterIndex];
  const rewardedPostKey = post?.id || '';
  const hasReadingReward = user?.completedReadingPosts.includes(rewardedPostKey);
  const hasCommentReward = user?.completedCommentPosts.includes(rewardedPostKey);

  const plan = user ? systemPlans[user.planId] : systemPlans.free;
  const readingLimitReached = stats.postsReadToday >= plan.readLimit;

  useEffect(() => {
    if (post) {
      window.scrollTo(0, 0);
      getPostInsights(post.title, post.chapters[0]?.content || '').then((res) => setInsight(res));
      
      if (!hasViewedRef.current) {
         viewPost(post.id);
         hasViewedRef.current = true;
      }
    }
  }, [post, viewPost]);

  useEffect(() => {
    if (user && activeChapter && !hasReadingReward && !readingLimitReached) {
      setTimeLeft(post?.readingTimeSeconds || 25);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeChapterIndex, user, hasReadingReward, readingLimitReached, activeChapter, post?.readingTimeSeconds]);

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      setRewardModal({ show: true, type: 'reading' });
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, timeLeft]);

  if (!post) return null;

  const handleClaim = async () => {
    const result = await addReward('reading', rewardedPostKey);
    if (!result.success) {
      if (result.message.toLowerCase().includes('limit reached')) {
        setLimitModalMessage(result.message);
        setShowLimitModal(true);
      } else {
        alert(result.message);
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setIsCommentSubmitting(true);
    const result = await submitCommentWithReward(post.id, commentText.trim());
    setIsCommentSubmitting(false);

    if (result.success) {
      setCommentText('');
      alert(result.message);
      return;
    }

    if (result.message.toLowerCase().includes('limit reached')) {
      setLimitModalMessage(result.message);
      setShowLimitModal(true);
      return;
    }

    alert(result.message);
  };

  const nextChapter = () => {
    if (activeChapterIndex < post.chapters.length - 1) {
      setActiveChapterIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevChapter = () => {
    if (activeChapterIndex > 0) {
      setActiveChapterIndex((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const targetTime = post?.readingTimeSeconds || 25;
  const progress = ((targetTime - timeLeft) / targetTime) * 100;

  return (
    <div className="bg-white min-h-screen pb-20">

      {user && !hasReadingReward && !readingLimitReached && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
          <div className="bg-slate-900 rounded-2xl p-4 shadow-2xl text-white flex items-center gap-4 border border-white/10">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 flex items-center justify-center relative">
              <Clock size={20} className="text-emerald-500" />
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="113"
                  strokeDashoffset={113 - (113 * progress) / 100}
                  className="text-emerald-500"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Reading to Earn</p>
              <p className="text-xs text-slate-300">{timeLeft > 0 ? `Active for ${timeLeft}s to unlock ₦${plan.readReward.toFixed(2)}` : 'Reward ready!'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-md mx-auto px-4 pt-8 md:pt-12">
        <div className="flex items-center gap-4 mb-4">
          <Link to={`/category/${post.category}`} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600">
            {post.category}
          </Link>
          {post.isStory && (
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-2 py-0.5 rounded-full">
              Chapter {activeChapterIndex + 1} of {post.chapters.length}
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 serif-text">{post.title}</h1>
        <div className="flex items-center gap-3 mb-8">
            <img src={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.author.name)}`} alt={post.author.name} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm" />
            <div>
               <p className="font-bold text-slate-900 leading-tight">{post.author.name} {post.author.username ? <span className="text-slate-500 font-medium">@{post.author.username}</span> : ''}</p>
               <p className="text-xs text-slate-500 font-medium">{post.publishDate} • {post.readingTime}</p>
            </div>
        </div>

        {post.isStory ? (
          <>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <BookOpen className="text-emerald-600" size={24} /> {activeChapter?.title}
            </h2>
            <div className="prose prose-slate prose-lg max-w-none serif-text leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: activeChapter?.content || '' }} />
          </>
        ) : (
          <div className="prose prose-slate prose-lg max-w-none serif-text leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: post.content }} />
        )}

        <AdsterraNativeBanner />

        {post.isStory && post.chapters.length > 1 && (
          <div className="mt-16 py-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={prevChapter}
              disabled={activeChapterIndex === 0}
              className="flex items-center gap-3 px-8 py-4 text-slate-400 font-black uppercase tracking-widest hover:text-slate-900 disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={20} /> Back
            </button>

            <div className="flex items-center gap-2">
              {post.chapters.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === activeChapterIndex ? 'bg-emerald-600 scale-125' : 'bg-slate-200'}`}></div>
              ))}
            </div>

            <button
              onClick={nextChapter}
              disabled={activeChapterIndex === post.chapters.length - 1}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black shadow-xl disabled:opacity-20 transition-all active:scale-95"
            >
              Next <ChevronRight size={20} />
            </button>
          </div>
        )}

        {post.isStory && activeChapterIndex === post.chapters.length - 1 && (
          <div className="my-12 p-8 bg-emerald-600 rounded-[2.5rem] text-white text-center shadow-2xl shadow-emerald-100 relative overflow-hidden">
            <div className="relative z-10">
              <Trophy size={48} className="mx-auto mb-4 text-amber-300" />
              <h3 className="text-2xl font-black mb-2">Knowledge Acquired</h3>
              <p className="text-emerald-100 mb-6">
                You've reached the end of this story. Engaging with our sponsored partners helps keep <span className="font-black">Jobba</span>
                <span className="text-black font-black">Works</span> free and rewarding.
              </p>
              <Link to="/" className="inline-block px-8 py-4 bg-white text-emerald-700 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all">
                Discover More
              </Link>
            </div>
          </div>
        )}

        <section className="py-16 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-black text-slate-900">Discussion</h3>
              {hasReadingReward && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={14} /> Earnings claimed from this post
                </div>
              )}
              {hasCommentReward && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <ShieldCheck size={14} /> Comment reward claimed
                </div>
              )}
            </div>
            {user && (
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                <Info size={12} /> Earn ₦{plan.commentReward.toFixed(2)} per meaningful comment
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your expert perspective..."
              className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-600 outline-none h-32 resize-none mb-4"
            />
            <button
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
              disabled={!commentText.trim() || isCommentSubmitting}
              onClick={handleCommentSubmit}
            >
              {isCommentSubmitting ? 'Submitting...' : 'Post Comment'}
            </button>
          </div>

          {post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="p-4 border border-slate-100 rounded-2xl bg-white">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{comment.authorName}</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 opacity-30">
              <MessageSquare size={48} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-400">Be the first to share a perspective.</p>
            </div>
          )}
        </section>
      </div>

      <ClaimRewardModal isOpen={rewardModal.show} onClose={() => setRewardModal((prev) => ({ ...prev, show: false }))} amount={plan.readReward} type="reading" onClaim={handleClaim} />

      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => {
          setShowLimitModal(false);
          setLimitModalShown();
        }}
        message={limitModalMessage}
      />
    </div>
  );
};

export default PostDetail;
