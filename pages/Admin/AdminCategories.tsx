import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const AdminCategories: React.FC = () => {
  const { categories, addCategory, editCategory, deleteCategory } = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleEdit = (oldCategory: string) => {
    setEditingCategory(oldCategory);
    setEditValue(oldCategory);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editingCategory) {
      editCategory(editingCategory, editValue.trim());
      setEditingCategory(null);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900">Manage Categories</h2>
        <p className="text-slate-500">Add, edit, or remove blog categories.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 mb-8">
        <form onSubmit={handleAdd} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category Name"
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
          />
          <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Category
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat} className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            {editingCategory === cat ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  autoFocus
                />
                <button onClick={handleSaveEdit} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                  <Check size={18} />
                </button>
                <button onClick={() => setEditingCategory(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <span className="font-bold text-slate-800">{cat}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(cat)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteCategory(cat)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
