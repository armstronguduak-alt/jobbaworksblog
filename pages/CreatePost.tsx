import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Category, Post } from '../types';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import PublishSuccessModal from '../components/PublishSuccessModal';
import { supabase } from '../src/integrations/supabase/client';
import {
  Save,
  Send,
  Image as ImageIcon,
  Type,
  Bold,
  Italic,
  List,
  ChevronLeft,
  Settings,
  X,
  Sparkles,
  Upload,
  FileText,
  Code,
  Pencil,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Loader2
} from 'lucide-react';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;

const htmlToPlainText = (html: string) =>
  html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const preserveImportedSpacing = (html: string) =>
  html
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/ {2,}/g, (match) => '&nbsp;'.repeat(Math.max(1, match.length - 1)) + ' ')
    .replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');

const generateAiImage = async (prompt: string): Promise<string> => {
  // Simulated Nano Banana API / fallback to pollinations.ai
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=400&nologo=true`);
    }, 2000);
  });
};

const CreatePost: React.FC = () => {
  const { posts, savePost, categories } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<Category>(categories[0] || 'Technology');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isStory, setIsStory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editorMode, setEditorMode] = useState<'preview' | 'html'>('preview');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showAiImagePrompt, setShowAiImagePrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const uploadImageToSupabase = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('post_images').upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('post_images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing your amazing article...' }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate prose-lg max-w-none serif-text leading-relaxed whitespace-pre-wrap break-words focus:outline-none min-h-[400px]',
      },
    },
  });

  useEffect(() => {
    if (id) {
      const post = posts.find((p) => p.id === id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        if (editor) editor.commands.setContent(post.content);
        setExcerpt(post.excerpt);
        setCategory(post.category);
        setFeaturedImage(post.featuredImage);
        setIsStory(post.isStory || false);
      }
    }
  }, [id, posts, editor]);

  const handleDocumentUpload = async (file: File) => {
    setImportError(null);
    setIsImporting(true);

    try {
      const lowerName = file.name.toLowerCase();
      let importedHtml = '';

      if (lowerName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer }, { preserveEmptyParagraphs: true });
        importedHtml = value;
      } else if (lowerName.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
        const pageBlocks: string[] = [];

        for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
          const page = await pdf.getPage(pageIndex);
          const textContent = await page.getTextContent();
          const lines: string[] = [];
          let currentLine = '';

          for (const rawItem of textContent.items as any[]) {
            const text = (rawItem?.str || '').toString();
            if (!text) continue;
            currentLine += `${text} `;
            if (rawItem?.hasEOL) {
              lines.push(currentLine.trimEnd());
              currentLine = '';
            }
          }

          if (currentLine.trim()) lines.push(currentLine.trimEnd());
          const pageHtml = lines
            .filter(Boolean)
            .map((line) => `<p>${line}</p>`)
            .join('');

          if (pageHtml) pageBlocks.push(pageHtml);
        }

        importedHtml = pageBlocks.join('');
      } else {
        throw new Error('Unsupported file type. Please upload a .docx or .pdf file.');
      }

      if (!importedHtml.trim()) {
        throw new Error('No readable content found in this file.');
      }

      const normalizedHtml = preserveImportedSpacing(importedHtml);
      setContent(normalizedHtml);
      if (editor) editor.commands.setContent(normalizedHtml);

      const plain = htmlToPlainText(normalizedHtml);
      if (!excerpt.trim()) {
        setExcerpt(`${plain.slice(0, 180)}${plain.length > 180 ? '...' : ''}`);
      }
      if (!title.trim()) {
        setTitle(file.name.replace(/\.(docx|doc|pdf)$/i, '').replace(/[-_]+/g, ' ').trim());
      }
      setEditorMode('preview');
    } catch (error: any) {
      setImportError(error?.message || 'Failed to import document.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleAction = async (status: 'draft' | 'pending') => {
    if (!title.trim()) {
      alert('Please provide a title');
      return;
    }

    const plainContent = htmlToPlainText(content);

    const postData: Partial<Post> = {
      id: id || undefined,
      title,
      content,
      excerpt: excerpt || `${plainContent.substring(0, 150)}...`,
      category,
      featuredImage: featuredImage || `https://picsum.photos/seed/${Math.random()}/1200/600`,
      status,
      isStory,
      slug: title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
    };

    try {
      await savePost(postData);
      
      if (status === 'draft') {
        alert('Draft saved!');
        navigate('/dashboard/posts');
      } else {
        setShowPublishModal(true);
      }
    } catch (error: any) {
      alert('Failed to save article: ' + (error?.message || error));
    }
  };

  const handleInsertAiImage = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingImg(true);
    try {
      const url = await generateAiImage(aiPrompt);
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      setShowAiImagePrompt(false);
      setAiPrompt('');
    } catch (error) {
      alert("Failed to generate image.");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  // Sync manual HTML edit back to TipTap
  const handleHtmlEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    if (editor) {
      editor.commands.setContent(val);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-4 py-3 md:px-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors" type="button">
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-sm font-bold text-slate-400 truncate">{id ? 'Editing Article' : 'New Article'}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => setShowSettings(true)} className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all" title="Article Settings" type="button">
            <Settings size={20} />
          </button>
          <button
            onClick={() => handleAction('draft')}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all"
            type="button"
          >
            <Save size={18} /> Save Draft
          </button>
          <button
            onClick={() => handleAction('pending')}
            className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
            type="button"
          >
            <Send size={18} /> Publish
          </button>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-10 md:py-16">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter an article title..."
          className="w-full text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 placeholder:text-slate-200 focus:outline-none resize-none overflow-hidden h-auto serif-text leading-tight mb-8"
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        <div className="mb-6 p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} /> Import Article Document
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Recommended: <strong>.docx</strong> for full typography. Imported content stays editable and preserves spacing/empty lines.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-emerald-700 transition-all">
              <Upload size={15} /> {isImporting ? 'Importing...' : 'Upload File'}
              <input
                type="file"
                className="hidden"
                accept=".doc,.docx,.pdf"
                disabled={isImporting}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleDocumentUpload(file);
                  e.currentTarget.value = '';
                }}
              />
            </label>
          </div>
          {importError && <p className="text-xs text-rose-600 mt-3 font-semibold">{importError}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-1 mb-6 p-2 bg-slate-50 rounded-2xl w-full">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-2.5 rounded-xl transition-all ${editor?.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}><Bold size={18} /></button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-2.5 rounded-xl transition-all ${editor?.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}><Italic size={18} /></button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2.5 rounded-xl transition-all ${editor?.isActive('heading', { level: 1 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}><Heading1 size={18} /></button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2.5 rounded-xl transition-all ${editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}><Heading2 size={18} /></button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2.5 rounded-xl transition-all ${editor?.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}><Heading3 size={18} /></button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-2.5 rounded-xl transition-all ${editor?.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}><List size={18} /></button>
          
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button 
            type="button" 
            onClick={() => {
              const url = window.prompt('URL:');
              if (url) {
                editor?.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`p-2.5 rounded-xl transition-all ${editor?.isActive('link') ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}
          >
           <Code size={18} />
          </button>

          <div className="relative group">
            <button 
              type="button" 
              className={`p-2.5 rounded-xl transition-all ${isUploadingImage ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 hover:bg-white'} relative cursor-pointer flex items-center gap-1`}
              title="Upload Image or enter URL"
            >
              <ImageIcon size={18} />
              {isUploadingImage && <Loader2 size={12} className="animate-spin" />}
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploadingImage}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploadingImage(true);
                  try {
                    const url = await uploadImageToSupabase(file);
                    editor?.chain().focus().setImage({ src: url }).run();
                  } catch (err) {
                    const url = window.prompt("Upload failed. Enter an Image URL manually:");
                    if (url) editor?.chain().focus().setImage({ src: url }).run();
                  } finally {
                    setIsUploadingImage(false);
                    e.target.value = '';
                  }
                }}
              />
            </button>
          </div>
          
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setShowAiImagePrompt(!showAiImagePrompt)} 
              className="flex items-center gap-2 px-3 py-2 text-emerald-600 font-bold text-xs hover:bg-emerald-50 rounded-xl transition-all whitespace-nowrap"
            >
              <Sparkles size={14} /> AI Image
            </button>
            {showAiImagePrompt && (
              <div className="absolute top-10 left-0 bg-white border border-slate-200 shadow-xl p-3 rounded-2xl w-64 z-10 flex flex-col gap-2">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe an image..."
                  className="w-full text-sm border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                  onClick={handleInsertAiImage} 
                  disabled={isGeneratingImg || !aiPrompt.trim()}
                  className="bg-emerald-600 text-white rounded-xl py-2 text-sm font-bold flex justify-center items-center gap-2 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isGeneratingImg ? <Loader2 size={16} className="animate-spin" /> : "Generate"}
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-slate-200 mx-2" />
          <button
            type="button"
            onClick={() => setEditorMode('preview')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              editorMode === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-white'
            }`}
          >
            <Pencil size={14} /> Rich Edit
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('html')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              editorMode === 'html' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-white'
            }`}
          >
            <Code size={14} /> HTML
          </button>
        </div>

        {editorMode === 'html' ? (
          <textarea
            value={content}
            onChange={handleHtmlEdit}
            placeholder="Write your article HTML here..."
            className="w-full text-base md:text-lg text-slate-700 placeholder:text-slate-300 focus:outline-none min-h-[500px] resize-none leading-relaxed font-mono bg-slate-50 border border-slate-100 rounded-2xl p-5"
          />
        ) : (
          <div className="min-h-[500px] rounded-3xl border border-slate-100 bg-white p-4 md:p-8 shadow-sm">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSettings(false)} />
          <div className="w-full max-w-md h-full bg-white relative z-10 shadow-2xl p-8 animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900">Article Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors" type="button">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Topic / Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      type="button"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        category === cat ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary for search and discovery..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-600 outline-none h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Featured Image Upload / URL</label>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsUploadingImage(true);
                        try {
                          const url = await uploadImageToSupabase(file);
                          setFeaturedImage(url);
                        } catch (err: any) {
                          alert('Error uploading Featured Image: ' + err.message);
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }}
                      disabled={isUploadingImage}
                      className="w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                  </div>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="url"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder={isUploadingImage ? "Uploading..." : "Or paste image URL https://..."}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm"
                    />
                  </div>
                </div>
                {featuredImage && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
                    <img src={featuredImage} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-800">Format as Story</label>
                  <p className="text-xs text-slate-500 mt-1">Enable chapters and paginated reading mode.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStory(!isStory)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isStory ? 'bg-emerald-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${isStory ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-3">
              <button onClick={() => handleAction('pending')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl active:scale-95" type="button">
                Ready to Publish
              </button>
              <button onClick={() => setShowSettings(false)} className="w-full py-4 text-slate-500 font-bold" type="button">
                Back to Editor
              </button>
            </div>
          </div>
        </div>
      )}

      <PublishSuccessModal 
        isOpen={showPublishModal} 
        onViewArticle={() => navigate('/dashboard/posts')} 
        onGoBack={() => navigate('/dashboard')} 
      />
    </div>
  );
};

export default CreatePost;
