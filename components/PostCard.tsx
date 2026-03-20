
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  variant?: 'large' | 'small' | 'minimal';
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'large' }) => {
  if (variant === 'minimal') {
    return (
      <Link to={`/post/${post.slug}`} className="group flex gap-6 items-start py-6 border-b border-slate-100 last:border-0">
        <span className="text-4xl font-black text-slate-100 group-hover:text-emerald-600 transition-all duration-500 mono-text">0{post.id}</span>
        <div>
          <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight text-lg">
            {post.title}
          </h4>
          <div className="mt-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>{post.author.name}</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <span>{post.publishDate}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className={`group flex flex-col ${variant === 'large' ? 'md:flex-row' : ''} gap-8 py-10 border-b border-slate-100 last:border-0 animate-fade-in`}>
      <Link 
        to={`/post/${post.slug}`} 
        className={`shrink-0 overflow-hidden rounded-[2rem] ${variant === 'large' ? 'md:w-2/5' : 'w-full'}`}
      >
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="aspect-[16/10] w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
      </Link>
      <div className="flex flex-col justify-between flex-1 py-2">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.15em]">
              {post.category}
            </span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{post.readingTime}</span>
          </div>
          <Link to={`/post/${post.slug}`}>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-[1.15] tracking-tight">
              {post.title}
            </h2>
          </Link>
          <p className="text-slate-500 line-clamp-2 mb-6 text-base md:text-lg leading-relaxed serif-text">
            {post.excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">{post.author.name}</span>
              <span className="text-[10px] font-medium text-slate-400">{post.publishDate}</span>
            </div>
          </div>
          <Link 
            to={`/post/${post.slug}`}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-emerald-600 group-hover:text-emerald-600 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33334 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 3.33334L12.6667 8L8 12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
