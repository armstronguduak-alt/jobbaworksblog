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
} from 'lucide-react';
import { PostStatus } from '../types';

const MyPosts: React.FC = () => {
  const { posts, user } = useAuth();
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
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'rejected':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">My Articles</h2>
          <p className="text-slate-500">
            Create, edit, and track your articles on <span className="text-emerald-600 font-bold">Jobba</span>
            <span className="text-black font-bold">Works</span>.
          </p>
        </div>
        <Link to="/dashboard/posts/create" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95">
          <Plus size={18} /> New Article
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Articles', value: stats.total, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'Published', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Drafts', value: stats.drafts, icon: PenLine, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
              <item.icon size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
            <h4 className="text-2xl font-black text-slate-900">{item.value}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'approved', 'pending', 'draft', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  filter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Filter articles..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-600" />
          </div>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img src={post.featuredImage} className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" alt={post.title} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 line-clamp-2">{post.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{post.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(post.status)}`}>
                  {post.status === 'approved' && <CheckCircle2 size={12} />}
                  {post.status === 'pending' && <Clock size={12} />}
                  {post.status === 'rejected' && <XCircle size={12} />}
                  {post.status}
                </span>
                <span className="text-xs text-slate-500 font-medium">{post.publishDate}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => navigate(`/post/${post.slug}`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Article">
                  <Eye size={18} />
                </button>
                <button onClick={() => navigate(`/dashboard/posts/edit/${post.id}`)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Edit Article">
                  <Edit3 size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && <div className="px-8 py-16 text-center text-slate-400 text-sm italic">No articles found. Start your first article today.</div>}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Article Title</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={post.featuredImage} className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" alt={post.title} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{post.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{post.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(post.status)}`}>
                        {post.status === 'approved' && <CheckCircle2 size={12} />}
                        {post.status === 'pending' && <Clock size={12} />}
                        {post.status === 'rejected' && <XCircle size={12} />}
                        {post.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-xs text-slate-500 font-medium">{post.publishDate}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/post/${post.slug}`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Article">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => navigate(`/dashboard/posts/edit/${post.id}`)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Edit Article">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-slate-400 text-sm italic">
                    No articles found. Start your first article today.
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
