
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
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* Premium Header */}
      <div className="bg-white pt-32 pb-24 px-4 border-b border-slate-200 shadow-sm relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#16A34A] transition-colors mb-8 font-bold text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#DCFCE7] rounded-2xl flex items-center justify-center text-[#16A34A] border border-[#16A34A]/20">
              <Hash size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#111827] tracking-tighter">{categoryName}</h1>
          </div>
          <p className="text-xl text-slate-500 max-w-2xl serif-text leading-relaxed">
            Deep dives and expert perspectives on {categoryName?.toLowerCase()}. Curated for high-performance individuals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-16">
          <main className="lg:w-2/3">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <h2 className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-500">Latest in {categoryName}</h2>
              <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">{filteredPosts.length} Stories</span>
            </div>
            
            <div className="flex flex-col gap-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Hash size={24} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500 serif-text text-lg">No approved stories found in this category yet.</p>
                </div>
              )}
            </div>
          </main>

          <aside className="lg:w-1/3">
            <div className="sticky top-24 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-500 mb-6">Explore Other Categories</h3>
              <div className="flex flex-wrap gap-2">
                {otherCategories.map(cat => (
                  <Link 
                    key={cat} 
                    to={`/category/${cat}`}
                    className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:border-[#16A34A] hover:text-[#16A34A] hover:bg-white transition-all"
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
