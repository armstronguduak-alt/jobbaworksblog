import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  CheckCircle2,
  XCircle,
  Edit3,
  ShieldAlert,
  ShieldCheck,
  BrainCircuit,
  Sparkles,
  Trash2,
  EyeOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BLOG_TOPIC_IDEAS } from '../../constants/topicIdeas';

const AdminModeration: React.FC = () => {
  const { posts, updatePostStatus, categories, generateArticleFromTopic, deletePost } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'rejected' | 'all' | 'approved'>('pending');
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const [generatorCategory, setGeneratorCategory] = useState<string>('Technology');
  const [generatorTopic, setGeneratorTopic] = useState<string>(BLOG_TOPIC_IDEAS.Technology[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredPosts = useMemo(() => {
    if (activeTab === 'all') return posts;
    return posts.filter((p) => p.status === activeTab);
  }, [activeTab, posts]);

  const handleStatus = async (id: string, status: 'approved' | 'rejected' | 'draft') => {
    const category = selectedCategories[id];
    await updatePostStatus(id, status, category);
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = window.confirm('Delete this article permanently?');
    if (!shouldDelete) return;
    await deletePost(id);
  };

  const handleCategoryChange = (id: string, category: string) => {
    setSelectedCategories((prev) => ({ ...prev, [id]: category }));
  };

  const handleGenerate = async () => {
    if (!generatorTopic || !generatorCategory) return;
    setIsGenerating(true);
    const res = await generateArticleFromTopic(generatorTopic, generatorCategory);
    setIsGenerating(false);
    alert(res.message);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 mb-8 shadow-sm">
        <div className="flex items-start gap-3 mb-6">
          <Sparkles className="text-emerald-600" size={20} />
          <div>
            <h3 className="text-xl font-black text-slate-900">AI Article Generator</h3>
            <p className="text-slate-500 text-sm">Generate SEO-ready 800–1200 word drafts from your approved topic ideas.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={generatorCategory}
            onChange={(e) => {
              const nextCategory = e.target.value;
              setGeneratorCategory(nextCategory);
              setGeneratorTopic(BLOG_TOPIC_IDEAS[nextCategory]?.[0] || '');
            }}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
          >
            {Object.keys(BLOG_TOPIC_IDEAS).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={generatorTopic}
            onChange={(e) => setGeneratorTopic(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium md:col-span-2"
          >
            {(BLOG_TOPIC_IDEAS[generatorCategory] || []).map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !generatorTopic}
          className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-60"
        >
          {isGenerating ? 'Generating draft...' : 'Generate Draft'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Content Moderation & QA</h2>
          <p className="text-slate-500">Approve, unpublish, reject, edit, or delete generated articles.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group relative overflow-hidden">
            {post.aiModeration && (
              <div className="absolute top-0 right-0 p-6 flex gap-2">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  post.aiModeration.grammarScore > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  <BrainCircuit size={12} /> QA: {post.aiModeration.grammarScore}%
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  post.aiModeration.plagiarismRisk === 'low' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {post.aiModeration.plagiarismRisk === 'low' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                  Risk: {post.aiModeration.plagiarismRisk}
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-64 h-48 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                <img src={post.featuredImage} className="w-full h-full object-cover" alt={post.title} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <select
                    value={selectedCategories[post.id] || post.category}
                    onChange={(e) => handleCategoryChange(post.id, e.target.value)}
                    className="text-[10px] font-black uppercase tracking-widest text-indigo-500 px-3 py-1 bg-indigo-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-400 font-medium">{post.publishDate}</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 leading-tight">{post.title}</h3>

                <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-amber-500" /> AI Moderation Summary
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed italic">{post.aiModeration?.summary || 'No AI report available for this draft.'}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatus(post.id, 'approved')}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={16} /> Publish
                  </button>
                  <button
                    onClick={() => handleStatus(post.id, 'draft')}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200"
                  >
                    <EyeOff size={16} /> Unpublish
                  </button>
                  <button
                    onClick={() => handleStatus(post.id, 'rejected')}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/posts/edit/${post.id}`)}
                    className="flex items-center gap-2 px-6 py-3 text-slate-500 hover:text-slate-900 font-black text-xs uppercase tracking-widest"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex items-center gap-2 px-6 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl font-black text-xs uppercase tracking-widest"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
            <CheckCircle2 className="text-emerald-500 mx-auto mb-6" size={64} />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Queue is Empty</h3>
            <p className="text-slate-500 max-w-sm mx-auto">All submitted content has been processed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModeration;
