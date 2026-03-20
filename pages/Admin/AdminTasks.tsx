import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/integrations/supabase/client';
import { Plus, Target, Trash2, Edit } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  reward_amount: number;
  target_count: number;
  task_type: string;
  status: string;
  required_plan: string;
  duration_hours: number;
  affiliate_url: string | null;
}

const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward_amount: 5000,
    target_count: 5,
    task_type: 'referrals',
    status: 'active',
    required_plan: 'all',
    duration_hours: 24,
    affiliate_url: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks' as any).select('*').order('created_at', { ascending: false });
    if (data) setTasks(data as any);
    setLoading(false);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('tasks' as any).insert([formData]);
    if (error) {
      alert(error.message);
    } else {
      setShowForm(false);
      fetchTasks();
      alert('Task created successfully');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    const { error } = await supabase.from('tasks' as any).delete().eq('id', id);
    if (!error) fetchTasks();
  };

  return (
    <div className="animate-in fade-in duration-500 w-full overflow-x-hidden">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Task Management</h2>
          <p className="text-slate-500">Create daily tasks and bounties for users.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all text-sm"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> New Task</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateTask} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 space-y-4">
          <h3 className="text-lg font-black text-slate-900 mb-4">Create New Task</h3>
          <input 
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
            placeholder="Task Title (e.g. Refer 5 people today)" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <textarea 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
            placeholder="Description..." 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Reward (₦)</label>
              <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200" value={formData.reward_amount} onChange={e => setFormData({...formData, reward_amount: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Target Count</label>
              <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200" value={formData.target_count} onChange={e => setFormData({...formData, target_count: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Task Type</label>
              <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200" value={formData.task_type} onChange={e => setFormData({...formData, task_type: e.target.value})}>
                <option value="referrals">Referrals</option>
                <option value="reads">Read Articles</option>
                <option value="comments">Comments</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
              <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Required Plan</label>
              <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200" value={formData.required_plan} onChange={e => setFormData({...formData, required_plan: e.target.value})}>
                <option value="all">All Plans</option>
                <option value="free">Free Tier</option>
                <option value="starter">Starter</option>
                <option value="proactive">Proactive</option>
                <option value="elite">Elite Growth</option>
                <option value="vip">VIP Power</option>
                <option value="executive">Executive Master</option>
                <option value="platinum">Platinum Master</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Duration (Hours)</label>
              <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200" value={formData.duration_hours} onChange={e => setFormData({...formData, duration_hours: Number(e.target.value)})} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">Affiliate / Target URL (Optional)</label>
              <input type="url" placeholder="https://..." className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200" value={formData.affiliate_url} onChange={e => setFormData({...formData, affiliate_url: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold mt-4 hover:bg-emerald-700">Publish Task</button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? <p>Loading tasks...</p> : tasks.map(task => (
           <div key={task.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center shrink-0">
                <Target size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-slate-900">{task.title}</h4>
                  <span className={`px-2 py-1 text-[10px] uppercase font-black tracking-widest rounded-md ${task.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold">
                  <span className="text-emerald-600 border border-emerald-100 bg-emerald-50 px-2 py-1 rounded-md">Reward: ₦{task.reward_amount.toLocaleString()}</span>
                  <span className="text-slate-500 border border-slate-200 bg-slate-50 px-2 py-1 rounded-md">Target: {task.target_count} {task.task_type}</span>
                  <span className="text-indigo-600 border border-indigo-100 bg-indigo-50 px-2 py-1 rounded-md">Plan: {task.required_plan}</span>
                  <span className="text-amber-600 border border-amber-100 bg-amber-50 px-2 py-1 rounded-md">Time: {task.duration_hours}h</span>
                  {task.affiliate_url && (
                    <span className="text-sky-600 border border-sky-100 bg-sky-50 px-2 py-1 rounded-md max-w-[150px] truncate">
                      URL: {task.affiliate_url}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => handleDelete(task.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 size={16} />
              </button>
           </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTasks;
