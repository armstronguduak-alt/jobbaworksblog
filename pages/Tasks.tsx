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
    <div className="max-w-4xl mx-auto space-y-8 pb-20 font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#DCFCE7] rounded-full text-[10px] font-black uppercase tracking-widest text-[#16A34A] mb-4 border border-green-200">
            <Sparkles size={12} className="text-[#16A34A]" /> Bounties & Missions
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-[#111827]">Complete Tasks.</h1>
          <p className="text-sm md:text-base text-[#6B7280] max-w-lg font-medium">
            Take on daily network missions to turbocharge your earnings. Real-time bounties update frequently.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#111827] mb-6 tracking-tight">Active Bounties</h2>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-white rounded-3xl border border-slate-100 shadow-sm"></div>
            <div className="h-40 bg-white rounded-3xl border border-slate-100 shadow-sm"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
             <Target className="mx-auto text-slate-300 mb-4" size={48} />
             <p className="text-[#6B7280] font-bold">No active missions available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map(task => {
              const ut = userTasks[task.id];
              const isClaimed = ut?.reward_claimed;
              const progressCount = ut?.progress || 0;
              const isComplete = progressCount >= task.target_count || ut?.completed;

              return (
                <div key={task.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-lg transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 text-[#16A34A] rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                      <Target size={24} />
                    </div>
                    <div className="px-3 py-1.5 bg-[#DCFCE7] text-[#16A34A] font-black text-[10px] uppercase tracking-widest rounded-lg flex items-center gap-1 border border-green-200">
                      <Gift size={12} /> ₦{task.reward_amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-black text-[#111827] mb-2">{task.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-slate-100 text-[#6B7280] border border-slate-200 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      Plan: {task.required_plan}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-[#6B7280] border border-slate-200 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock size={10} /> {task.duration_hours}H
                    </span>
                  </div>
                  <p className="text-[13px] text-[#6B7280] font-medium mb-6 flex-1 leading-relaxed">{task.description}</p>
                  
                  <div className="space-y-4 mt-auto">
                    {!isClaimed && (
                      <div className="bg-slate-50 rounded-2xl px-4 py-4 border border-slate-100">
                        <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2.5">
                          <span>Progress</span>
                          <span className={isComplete ? "text-[#16A34A]" : "text-[#111827]"}>{progressCount} / {task.target_count}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#16A34A] h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min((progressCount / task.target_count) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {isClaimed ? (
                      <div className="w-full py-4 bg-[#DCFCE7] text-[#16A34A] border border-green-200 font-bold text-center rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wide text-[11px]">
                        <CheckCircle2 size={16} /> Reward Claimed
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {task.affiliate_url && (
                           <a 
                             href={task.affiliate_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-[#111827] font-bold rounded-2xl text-center text-xs uppercase tracking-wider transition-all border border-slate-200"
                           >
                             Step 1: Open Target URL
                           </a>
                        )}
                        <button 
                          onClick={() => handleClaim(task.id)}
                          disabled={claiming === task.id || (task.required_plan !== 'all' && user?.planId !== task.required_plan)} 
                          className="w-full py-3.5 bg-[#16A34A] hover:bg-green-700 text-white font-bold rounded-2xl active:scale-[0.98] transition-all text-xs uppercase tracking-wider shadow-sm disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400"
                        >
                          {claiming === task.id ? 'Claiming...' : (task.required_plan !== 'all' && user?.planId !== task.required_plan) ? `Requires ${task.required_plan.toUpperCase()} Plan` : 'Claim Reward'}
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
