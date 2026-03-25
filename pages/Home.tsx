
import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';

import { HIGH_RPM_CATEGORIES } from '../constants';
import { 
  Search, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  ArrowUpRight,
  ChevronLeft,
  Trophy
} from 'lucide-react';

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, categories } = useAuth();
  const query = searchParams.get('search')?.toLowerCase();
  const activeCategory = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const postsPerPage = 6;

  const approvedPosts = useMemo(() => posts.filter(p => p.status === 'approved'), [posts]);

  // Priority Content: High RPM + Trending
  const priorityPosts = useMemo(() => {
    return approvedPosts
      .filter(p => HIGH_RPM_CATEGORIES.includes(p.category) || p.trending)
      .sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
      .slice(0, 4);
  }, [approvedPosts]);

  const filteredPosts = useMemo(() => {
    let result = approvedPosts;
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }
    if (query) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.excerpt.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
      );
    }
    return result;
  }, [query, activeCategory, approvedPosts]);

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, page]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen font-sans">

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
        {/* Search Bar */}
        <div className="relative mb-8">
           <input 
             type="text" 
             placeholder="Search articles..."
             value={query || ''}
             onChange={(e) => {
               if (e.target.value) {
                 searchParams.set('search', e.target.value);
               } else {
                 searchParams.delete('search');
               }
               setSearchParams(searchParams);
             }}
             className="w-full bg-[#F3F4F6] text-[#111827] px-6 py-4 rounded-full text-[15px] font-medium placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#047857]/20 transition-all border-none"
           />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button
            onClick={() => {
              searchParams.delete('category');
              searchParams.set('page', '1');
              setSearchParams(searchParams);
            }}
            className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
              !activeCategory
                ? 'bg-[#16A34A] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            All
          </button>
          
          <button className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all bg-white text-slate-600 hover:bg-slate-50 border border-slate-200`}>
            Trending
          </button>
          
          <button className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all bg-white text-slate-600 hover:bg-slate-50 border border-slate-200`}>
            High Earnings
          </button>
          
          <button className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all bg-white text-slate-600 hover:bg-slate-50 border border-slate-200`}>
            Newest
          </button>
        </div>

        <div className="flex flex-col gap-10">
          <main className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paginatedPosts.map((post, index) => (
                <div key={post.id} className={page === 1 && index === 0 && !activeCategory && !query ? "md:col-span-2 lg:col-span-2" : ""}>
                   <PostCard post={post} variant={page === 1 && index === 0 && !activeCategory && !query ? "featured" : "standard"} />
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="py-24 text-center bg-slate-50 rounded-[2rem] mt-8">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#111827] mb-2">No Content Found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your search or category filters.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-3">
                <button 
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#16A34A] hover:text-white disabled:opacity-30 transition-all font-bold"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all border border-slate-200 ${
                        page === p 
                          ? 'bg-[#16A34A] text-white border-[#16A34A]' 
                          : 'bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#16A34A] hover:text-white disabled:opacity-30 transition-all font-bold"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
