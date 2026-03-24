import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Target, Gift, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { supabase } from '../src/integrations/supabase/client';
import { Task, UserTask } from '../types';

const Tasks: React.FC = () => {
  const { user, stats } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<Record<string, UserTask>>({});
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const { data: tData } = await supabase.from('tasks' as any).select('*').eq('status', 'active');
      const { data: utData } = await supabase.from('user_tasks' as any).select('*').eq('user_id', user.id);
      
      setTasks((tData as any) || []);
      const mapping: Record<string, UserTask> = {};
      utData?.forEach((ut: any) => {
        mapping[ut.task_id] = ut;
      });
      setUserTasks(mapping);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (taskId: string) => {
    try {
      setClaiming(taskId);
      const { data, error } = await supabase.rpc('claim_task_reward' as any, { p_task_id: taskId });
      if (error) alert(error.message);
      else if (data?.success) {
        alert('Reward claimed successfully, wallet updated!');
        fetchTasks();
      } else {
        alert(data?.message || 'Failed to claim');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 fade-in animate-in">
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-[#0A0D14] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden border border-indigo-500/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141A29]/80 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 border border-slate-700">
            <Sparkles size={14} className="text-amber-400" /> Bounties & Missions
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md">Complete Tasks.</h1>
          <p className="text-xl text-indigo-200/80 max-w-2xl leading-relaxed">
            Take on daily network missions to turbocharge your earnings. Real-time bounties update daily.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Active Bounties</h2>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-[#141A29] rounded-[2rem] border border-slate-800"></div>
            <div className="h-32 bg-[#141A29] rounded-[2rem] border border-slate-800"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-[#0A0D14]/80 backdrop-blur-md rounded-[2rem] border border-slate-800 shadow-xl">
             <Target className="mx-auto text-slate-600 mb-4" size={48} />
             <p className="text-slate-400 font-bold">No active missions available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map(task => {
              const ut = userTasks[task.id];
              const isClaimed = ut?.reward_claimed;
              // Demo progress handler - replace with real logic if needed
              const progressCount = ut?.progress || 0;
              const isComplete = progressCount >= task.target_count || ut?.completed;

              return (
                <div key={task.id} className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2rem] border border-slate-800 p-6 flex flex-col shadow-2xl hover:bg-[#141A29] transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[#1A2234] text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700 shadow-inner group-hover:border-indigo-500/30 transition-colors">
                      <Target size={24} className="drop-shadow-[0_0_5px_rgba(99,102,241,0.3)]" />
                    </div>
                    <div className="px-3 py-1 bg-amber-500/10 text-amber-400 font-black text-[10px] uppercase tracking-widest rounded-lg flex items-center gap-1 border border-amber-500/20 shadow-[0_0_8px_rgba(251,191,36,0.1)]">
                      <Gift size={12} /> ₦{task.reward_amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-2">{task.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[10px] font-black uppercase tracking-wider">
                      Plan: {task.required_plan}
                    </span>
                    <span className="px-2 py-1 bg-[#1A2234] text-slate-400 border border-slate-700 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Clock size={10} /> {task.duration_hours}H
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-6 flex-1 leading-relaxed">{task.description}</p>
                  
                  <div className="space-y-4 mt-auto">
                    {!isClaimed && (
                      <div className="bg-[#1A2234]/50 rounded-xl px-4 py-3 border border-slate-800">
                        <div className="flex justify-between text-[11px] font-black tracking-widest uppercase text-slate-500 mb-2">
                          <span>Progress</span>
                          <span className={isComplete ? "text-emerald-400" : ""}>{progressCount} / {task.target_count}</span>
                        </div>
                        <div className="w-full bg-[#0A0D14] h-2 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.8)]" 
                            style={{ width: `${Math.min((progressCount / task.target_count) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {isClaimed ? (
                      <div className="w-full py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-center rounded-xl flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px] shadow-[inset_0_0_15px_rgba(52,211,153,0.1)]">
                        <CheckCircle2 size={16} /> Reward Claimed
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {task.affiliate_url && (
                           <a 
                             href={task.affiliate_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="w-full py-3 bg-[#1A2234] hover:bg-slate-800 text-indigo-400 font-extrabold rounded-xl text-center text-xs uppercase tracking-widest shadow-sm transition-all border border-slate-700"
                           >
                             Step 1: Open Target URL
                           </a>
                        )}
                        <button 
                          onClick={() => handleClaim(task.id)}
                          disabled={claiming === task.id || (task.required_plan !== 'all' && user?.planId !== task.required_plan)} 
                          className="w-full py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-black rounded-xl active:scale-95 transition-all text-xs uppercase tracking-[0.1em] shadow-md disabled:bg-slate-800 disabled:border-slate-800 disabled:text-slate-600 border border-indigo-500/30"
                        >
                          {claiming === task.id ? 'Claiming...' : (task.required_plan !== 'all' && user?.planId !== task.required_plan) ? `Requires ${task.required_plan.toUpperCase()} Plan` : 'Simulate Claim Reward'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
