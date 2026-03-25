
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  variant?: 'featured' | 'standard';
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'standard' }) => {
  const { user } = useAuth();
  // We'll mimic the static standard rate of $0.85 as seen on the designs, or display standard platform earnings. N500.00
  const rewardText = `₦250.00`;

  return (
    <article className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow animate-fade-in relative max-w-sm w-full mx-auto md:max-w-none hover:border-green-200">
      <Link to={`/post/${post.slug}`} className="block relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        {post.trending && (
          <div className="absolute top-4 left-4 bg-[#16A34A] text-white px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
            Featured
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-widest">
            {post.category}
          </span>
          <span className="text-slate-300 font-bold text-[10px]">•</span>
          <span className="text-[11px] font-bold text-slate-500">{post.readingTime}</span>
        </div>
        
        <Link to={`/post/${post.slug}`}>
          <h2 className="text-[20px] font-bold text-[#111827] leading-tight mb-3 group-hover:text-[#16A34A] transition-colors tracking-tight">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-[14px] text-slate-500 leading-relaxed line-clamp-2 mb-6 flex-1 font-medium">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          {/* ONLY show reward if a user is logged in (To prevent Google Flagging) */}
          {user ? (
            <div className="bg-[#DCFCE7] text-[#16A34A] px-3 py-1.5 rounded-full text-[12px] font-extrabold flex items-center gap-1.5 font-mono shadow-[inset_0_1px_2px_rgba(22,163,74,0.1)]">
              <div className="w-3.5 h-3.5 bg-[#16A34A] rounded-full flex items-center justify-center text-white text-[9px] font-bold sm:hidden md:flex">₦</div>
              {rewardText}
            </div>
          ) : (
             <div className="w-10"></div>
          )}

          <button className="text-[#6B7280] hover:text-[#16A34A] hover:bg-green-50 p-2 rounded-full transition-colors w-10 h-10 flex items-center justify-center -mr-2">
             <Bookmark size={20} className="stroke-[1.5]" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
