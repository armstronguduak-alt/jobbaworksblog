import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3,
  Eye,
  Search,
  PenLine,
  Gift,
} from 'lucide-react';
import { PostStatus } from '../types';

const MyPosts: React.FC = () => {
  const { posts, user, addReward, systemPlans } = useAuth();
  const [isClaiming, setIsClaiming] = useState<string | null>(null);
  const [filter, setFilter] = useState<PostStatus | 'all'>('all');
  const navigate = useNavigate();

  const userPosts = posts.filter((p) => p.authorId === user?.id);
  const filteredPosts = filter === 'all' ? userPosts : userPosts.filter((p) => p.status === filter);

  const stats = {
    total: userPosts.length,
    approved: userPosts.filter((p) => p.status === 'approved').length,
    pending: userPosts.filter((p) => p.status === 'pending').length,
    drafts: userPosts.filter((p) => p.status === 'draft').length,
  };

  const getStatusStyle = (status: PostStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800/50 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">My Articles</h2>
          <p className="text-slate-400 mt-1">
            Create, edit, and track your articles on <span className="text-indigo-400 font-bold drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">Jobba</span>
            <span className="text-slate-300 font-bold">Works</span>.
          </p>
        </div>
        <Link to="/dashboard/posts/create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-2xl font-black hover:bg-indigo-500/30 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">
          <Plus size={16} /> New Article
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Articles', value: stats.total, icon: FileText, color: 'text-indigo-400', bg: 'bg-[#1A2234]', border: 'group-hover:border-indigo-500/30' },
          { label: 'Published', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-[#1A2234]', border: 'group-hover:border-emerald-500/30' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-[#1A2234]', border: 'group-hover:border-amber-500/30' },
          { label: 'Drafts', value: stats.drafts, icon: PenLine, color: 'text-slate-400', bg: 'bg-[#1A2234]', border: 'group-hover:border-slate-500/30' },
        ].map((item) => (
          <div key={item.label} className={`bg-[#0A0D14]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-[2rem] shadow-xl group transition-colors ${item.border} relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${item.color.replace('text', 'bg').replace('400', '500/10')}`}></div>
            <div className={`w-12 h-12 ${item.bg} ${item.color} border border-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-inner relative z-10 transition-colors group-hover:border-slate-600`}>
              <item.icon size={22} className="drop-shadow-[0_0_5px_currentColor]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 relative z-10">{item.label}</p>
            <h4 className="text-3xl font-black text-white relative z-10">{item.value}</h4>
          </div>
        ))}
      </div>

      <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'approved', 'pending', 'draft', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all border ${
                  filter === s ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-[#1A2234] text-slate-500 border-slate-700 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="FILTER ARTICLES..." className="w-full pl-10 pr-4 py-2.5 bg-[#141A29]/50 border border-slate-700 rounded-xl text-xs font-black tracking-widest text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all uppercase placeholder:text-slate-600" />
          </div>
        </div>

        <div className="md:hidden divide-y divide-slate-800/50">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-5 space-y-4 hover:bg-[#141A29]/30 transition-colors">
              <div className="flex items-center gap-4">
                <img src={post.featuredImage} className="w-14 h-14 rounded-xl object-cover shadow-md shrink-0 border border-slate-700" alt={post.title} />
                <div className="min-w-0">
                  <p className="text-sm font-black text-white line-clamp-2">{post.title}</p>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">{post.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusStyle(post.status)}`}>
                  {post.status === 'approved' && <CheckCircle2 size={12} />}
                  {post.status === 'pending' && <Clock size={12} />}
                  {post.status === 'rejected' && <XCircle size={12} />}
                  {post.status}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{post.publishDate}</span>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/50">
                {post.status === 'approved' && !post.authorEarningsClaimed && (
                  <button 
                    disabled={isClaiming === post.id}
                    onClick={async () => {
                      setIsClaiming(post.id);
                      // Provide standard reward, e.g. 500 NGN or plan reading * 10 
                      const res = await addReward('post_approval', post.id, 500);
                      setIsClaiming(null);
                      if (res.success) alert(res.message);
                      else alert(res.message);
                    }}
                    className="p-2 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all flex items-center gap-1 text-[10px] font-black uppercase" 
                    title="Claim Reward"
                  >
                    {isClaiming === post.id ? '...' : <Gift size={16} />}
                  </button>
                )}
                <button onClick={() => navigate(`/post/${post.slug}`)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 rounded-lg transition-all" title="View Article">
                  <Eye size={18} />
                </button>
                <button onClick={() => navigate(`/dashboard/posts/edit/${post.id}`)} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 rounded-lg transition-all" title="Edit Article">
                  <Edit3 size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && <div className="px-8 py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No articles found in databank.</div>}
        </div>

        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-[#141A29]/30 border-b border-slate-800">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Article Asset</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center whitespace-nowrap">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center whitespace-nowrap">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredPosts.map((post, i) => (
                <tr key={post.id} className={`hover:bg-[#141A29]/50 transition-colors group ${i % 2 === 0 ? 'bg-[#141A29]/20' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={post.featuredImage} className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0 border border-slate-700" alt={post.title} />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white line-clamp-1">{post.title}</p>
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">{post.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${getStatusStyle(post.status)}`}>
                        {post.status === 'approved' && <CheckCircle2 size={12} />}
                        {post.status === 'pending' && <Clock size={12} />}
                        {post.status === 'rejected' && <XCircle size={12} />}
                        {post.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-[11px] text-slate-500 font-bold uppercase tracking-wider">{post.publishDate}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === 'approved' && !post.authorEarningsClaimed && (
                        <button 
                          disabled={isClaiming === post.id}
                          onClick={async () => {
                            setIsClaiming(post.id);
                            const res = await addReward('post_approval', post.id, 500);
                            setIsClaiming(null);
                            if (res.success) alert(res.message);
                            else alert(res.message);
                          }}
                          className="px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em]"
                          title="Claim Post Reward"
                        >
                          {isClaiming === post.id ? 'Claiming...' : <><Gift size={14} /> Claim</>}
                        </button>
                      )}
                      <button onClick={() => navigate(`/post/${post.slug}`)} className="p-2 border border-transparent text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 rounded-xl transition-all" title="View Article">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => navigate(`/dashboard/posts/edit/${post.id}`)} className="p-2 border border-transparent text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/20 rounded-xl transition-all" title="Edit Article">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                    No articles found in databank.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
