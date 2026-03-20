
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import { ArrowLeft, Hash } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { posts, categories } = useAuth();

  const filteredPosts = useMemo(() => {
    return posts.filter(p => p.category === categoryName && p.status === 'approved');
  }, [categoryName, posts]);

  const otherCategories = categories.filter(c => c !== categoryName);

  return (
    <div className="bg-white min-h-screen">
      {/* Premium Header */}
      <div className="bg-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-bold text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Hash size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{categoryName}</h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl serif-text leading-relaxed">
            Deep dives and expert perspectives on {categoryName?.toLowerCase()}. Curated for high-performance individuals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-16">
          <main className="lg:w-2/3">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <h2 className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-400">Latest in {categoryName}</h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{filteredPosts.length} Stories</span>
            </div>
            
            <div className="flex flex-col gap-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Hash size={24} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 serif-text text-lg">No approved stories found in this category yet.</p>
                </div>
              )}
            </div>
          </main>

          <aside className="lg:w-1/3">
            <div className="sticky top-24 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
              <h3 className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-400 mb-6">Explore Other Categories</h3>
              <div className="flex flex-wrap gap-2">
                {otherCategories.map(cat => (
                  <Link 
                    key={cat} 
                    to={`/category/${cat}`}
                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-lg hover:shadow-emerald-100 transition-all"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
