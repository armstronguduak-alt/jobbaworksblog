import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Plus, Trash2, Download, Copy, Pencil, Check } from 'lucide-react';
import { supabase } from '../src/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

type Promotion = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string | null;
  is_active: boolean;
};

const Promotional: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    cta_text: 'Promote now',
    cta_url: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('promotions')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('promotions').getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const loadPromotions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });
    setPromotions((data || []) as Promotion[]);
    setLoading(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Promotional text copied to clipboard!');
    } catch (err) {
      alert('Failed to copy text.');
    }
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jobbaworks-promo-${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(imageUrl, '_blank');
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (editingId) {
      const { error } = await supabase.from('promotions').update({
        ...form,
        cta_url: form.cta_url || null,
      }).eq('id', editingId);

      if (!error) {
        setForm({ title: '', description: '', image_url: '', cta_text: 'Promote now', cta_url: '' });
        setEditingId(null);
        loadPromotions();
      }
    } else {
      const { error } = await supabase.from('promotions').insert({
        ...form,
        cta_url: form.cta_url || null,
        created_by_user_id: user.id,
        is_active: true,
      });

      if (!error) {
        setForm({ title: '', description: '', image_url: '', cta_text: 'Promote now', cta_url: '' });
        loadPromotions();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    await supabase.from('promotions').delete().eq('id', id);
    loadPromotions();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <Megaphone size={14} /> Promotional Hub
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Promotional Campaigns</h1>
          <p className="text-slate-500">Share ready-made product promotions to help users grow JobbaWorks reach and conversions.</p>
        </div>

        {isAdmin && (
          <form onSubmit={handleCreate} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 mb-10 shadow-sm transition-all" id="promo-form">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-black text-slate-900">
                {editingId ? 'Edit Promotion' : 'Add Promotion'}
              </h2>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', image_url: '', cta_text: 'Promote now', cta_url: '' }); }} className="text-xs font-bold text-slate-400 hover:text-slate-600">Cancel Edit</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Promotion title"
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                required
              />
              <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border border-emerald-100 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">OR URL</span>
                  <input
                    value={form.image_url}
                    onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                    placeholder={uploading ? "Uploading..." : "https://..."}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
              <input
                value={form.cta_text}
                onChange={(e) => setForm((prev) => ({ ...prev, cta_text: e.target.value }))}
                placeholder="CTA text"
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                required
              />
              <input
                value={form.cta_url}
                onChange={(e) => setForm((prev) => ({ ...prev, cta_url: e.target.value }))}
                placeholder="CTA URL"
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 md:col-span-2 h-24"
                required
              />
            </div>
            <button className="mt-4 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-emerald-700">
              {editingId ? <><Check size={14} /> Update Promotion</> : <><Plus size={14} /> Add Promotion</>}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-slate-500">Loading promotions...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((item) => (
              <article key={item.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between gap-3">
                    {item.cta_url ? (
                      <a href={item.cta_url} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
                        {item.cta_text}
                      </a>
                    ) : (
                      <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest">{item.cta_text}</span>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => handleDownload(item.image_url, item.title)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" title="Download Image">
                        <Download size={16} />
                      </button>
                      <button onClick={() => handleCopy(item.description)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" title="Copy Text">
                        <Copy size={16} />
                      </button>
                      {isAdmin && (
                        <>
                          <button onClick={() => {
                            setEditingId(item.id);
                            setForm({
                              title: item.title,
                              description: item.description,
                              image_url: item.image_url,
                              cta_text: item.cta_text,
                              cta_url: item.cta_url || '',
                            });
                            document.getElementById('promo-form')?.scrollIntoView({ behavior: 'smooth' });
                          }} className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors" title="Edit Promotion">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors" title="Delete Promotion">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link to="/" className="text-sm font-bold text-emerald-600">← Back to blog</Link>
        </div>
      </div>
    </div>
  );
};

export default Promotional;
