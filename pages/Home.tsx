
import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import AdUnit from '../components/AdUnit';
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
    <div className="bg-[#F8FAFC] min-h-screen font-sans">

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        {query ? (
          <div className="mb-16 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Search results for "{query}"</h1>
            <p className="text-slate-500 serif-text text-lg">{filteredPosts.length} matches found in the ecosystem</p>
          </div>
        ) : (
          !activeCategory && page === 1 && (
            <section className="mb-24">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">High-Value Perspectives</h2>
                    <p className="text-sm text-slate-500 serif-text">Curated insights driving the conversation.</p>
                  </div>
                </div>
                <Link to="/category/Technology" className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm">
                  View All <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {priorityPosts.map(post => (
                  <PostCard key={post.id} post={post} variant="small" />
                ))}
              </div>
            </section>
          )
        )}

        <div className="flex flex-col lg:flex-row gap-20">
          <main className="lg:w-2/3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Globe size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Global Feed</h2>
              </div>
              
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    searchParams.delete('category');
                    searchParams.set('page', '1');
                    setSearchParams(searchParams);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    !activeCategory
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 4).map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === category
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {paginatedPosts.map((post, index) => (
                <div key={post.id} className={index === 0 && !activeCategory ? "md:col-span-2" : ""}>
                   <PostCard post={post} variant={index === 0 && !activeCategory ? "large" : "small"} />
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="py-32 text-center bg-white rounded-[3rem] shadow-sm border border-slate-100 mt-8">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Content Found</h3>
                <p className="text-slate-500 serif-text text-lg">Try adjusting your search or category filters.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex items-center justify-center gap-3">
                <button 
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 hover:shadow-lg disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        page === p 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 hover:shadow-lg disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </main>

          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-12">
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                    <Trophy size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Expert Contributions</h3>
                </div>
                <div className="space-y-6">
                  {approvedPosts.slice(0, 5).map((post, idx) => (
                    <Link key={post.id} to={`/post/${post.slug}`} className="group flex gap-5 items-start p-4 -mx-4 rounded-2xl hover:bg-slate-50 transition-colors">
                      <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-500 transition-colors mono-text mt-1">0{idx + 1}</span>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight mb-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
                            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {post.author.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <AdUnit type="rectangle" />

              <section className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Zap className="w-7 h-7 text-slate-900" fill="currentColor" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tight leading-tight">Elite Tier Access</h3>
                  <p className="text-slate-400 mb-8 serif-text leading-relaxed text-lg">Unlock high-RPM assignments and deep-dive reports targeting premium global markets.</p>
                  <Link to="/plans" className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-50 transition-all hover:shadow-lg">
                    Upgrade Now <ArrowUpRight size={18} />
                  </Link>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full -ml-24 -mb-24 blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
