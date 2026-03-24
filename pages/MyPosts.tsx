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
  const { posts, user, addReward } = useAuth();
  const [isClaiming, setIsClaiming] = useState<string | null>(null);
  const [filter, setFilter] = useState<PostStatus | 'all'>('all');
  const navigate = useNavigate();

  const userPosts = posts.filter((p) => p.authorId === user?.id);
  const filteredPosts = filter === 'all' ? userPosts : userPosts.filter((p) => p.status === filter);

  // Calculate total views for all approved posts
  const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);

  const stats = {
    total: userPosts.length,
    approved: userPosts.filter((p) => p.status === 'approved').length,
    pending: userPosts.filter((p) => p.status === 'pending').length,
    views: totalViews,
  };

  const getStatusStyle = (status: PostStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-[#DCFCE7] text-[#16A34A] border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'rejected':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1">My Articles</h2>
          <p className="text-[#6B7280] text-sm">
            Create, edit, and track your articles on <span className="text-[#16A34A] font-bold">Jobba</span>
            <span className="text-[#111827] font-bold">Works</span>.
          </p>
        </div>
        <Link to="/dashboard/posts/create" className="inline-flex items-center gap-2 px-6 py-3 bg-[#16A34A] text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm text-sm">
          <Plus size={16} /> New Article
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Articles', value: stats.total, icon: FileText },
          { label: 'Published', value: stats.approved, icon: CheckCircle2 },
          { label: 'Pending', value: stats.pending, icon: Clock },
          { label: 'Total Views', value: stats.views, icon: Eye },
        ].map((item, idx) => (
          <div key={item.label} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 bg-[#DCFCE7] text-[#16A34A] rounded-xl flex items-center justify-center mb-4">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">{item.label}</p>
              <h4 className="text-2xl font-bold text-[#111827]">{item.value.toLocaleString()}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'approved', 'pending', 'draft', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  filter === s ? 'bg-[#16A34A] text-white shadow-sm' : 'bg-slate-50 text-[#6B7280] hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search articles..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-[#111827] outline-none focus:ring-2 focus:ring-[#16A34A] transition-all placeholder:text-slate-400" />
          </div>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-5 space-y-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <img src={post.featuredImage} className="w-12 h-12 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200" alt={post.title} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#111827] line-clamp-2">{post.title}</p>
                  <p className="text-[10px] text-[#16A34A] font-bold uppercase tracking-wider mt-1">{post.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(post.status)}`}>
                  {post.status === 'approved' && <CheckCircle2 size={12} />}
                  {post.status === 'pending' && <Clock size={12} />}
                  {post.status === 'rejected' && <XCircle size={12} />}
                  {post.status}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Eye size={12} /> {post.views || 0} views
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
                    className="p-2 text-[#16A34A] bg-[#DCFCE7] hover:bg-green-200 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold uppercase" 
                    title="Claim Reward"
                  >
                    {isClaiming === post.id ? '...' : <Gift size={16} />}
                  </button>
                )}
                <button onClick={() => navigate(`/post/${post.slug}`)} className="p-2 text-[#6B7280] hover:text-[#16A34A] hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-lg transition-colors" title="View Article">
                  <Eye size={16} />
                </button>
                <button onClick={() => navigate(`/dashboard/posts/edit/${post.id}`)} className="p-2 text-[#6B7280] hover:text-[#16A34A] hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-lg transition-colors" title="Edit Article">
                  <Edit3 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && <div className="px-8 py-16 text-center text-[#6B7280] text-sm font-medium">No articles found.</div>}
        </div>

        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Article</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider text-center whitespace-nowrap">Views</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider text-center whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={post.featuredImage} className="w-12 h-12 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200" alt={post.title} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#111827] line-clamp-1">{post.title}</p>
                        <p className="text-[10px] text-[#16A34A] font-bold uppercase tracking-wider mt-1">{post.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusStyle(post.status)}`}>
                        {post.status === 'approved' && <CheckCircle2 size={10} />}
                        {post.status === 'pending' && <Clock size={10} />}
                        {post.status === 'rejected' && <XCircle size={10} />}
                        {post.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-[#111827] font-bold">{(post.views || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-[11px] text-[#6B7280] font-medium">{post.publishDate}</td>
                  <td className="px-6 py-4 text-right">
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
                          className="px-3 py-2 bg-[#DCFCE7] text-[#16A34A] hover:bg-green-200 rounded-lg transition-colors flex items-center gap-2 text-[10px] font-bold uppercase"
                          title="Claim Post Reward"
                        >
                          {isClaiming === post.id ? 'Claiming...' : <><Gift size={14} /> Claim</>}
                        </button>
                      )}
                      <button onClick={() => navigate(`/post/${post.slug}`)} className="p-2 border border-slate-200 text-[#6B7280] hover:text-[#16A34A] hover:bg-slate-50 rounded-lg transition-colors bg-white shadow-sm" title="View Article">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => navigate(`/dashboard/posts/edit/${post.id}`)} className="p-2 border border-slate-200 text-[#6B7280] hover:text-[#16A34A] hover:bg-slate-50 rounded-lg transition-colors bg-white shadow-sm" title="Edit Article">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-[#6B7280] text-sm font-medium">
                    No articles found.
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
