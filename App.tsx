
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, Circle, Calendar, Trophy, Sparkles, BookOpen, 
  MessageCircle, ChevronRight, Menu, X, ArrowUpRight, CloudSync,
  Loader2, AlertCircle
} from 'lucide-react';
import { INITIAL_SCHEDULE, SUBJECT_COLORS } from './constants.ts';
import { DayPlan, StudyTask, UserStats } from './types.ts';
import { getStudyBuddyAdvice } from './services/geminiService.ts';
import { supabase } from './services/supabaseClient.ts';

const App: React.FC = () => {
  const [schedule, setSchedule] = useState<DayPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'stats' | 'ai'>('daily');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize and load from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        // Seed the database if empty
        const allTasks = INITIAL_SCHEDULE.flatMap(day => 
          day.tasks.map(task => ({
            ...task,
            is_revision_day: day.isRevisionDay || false,
            created_at: new Date().toISOString()
          }))
        );
        
        const { error: seedError } = await supabase.from('tasks').insert(allTasks);
        if (seedError) throw seedError;
        
        // Map back to DayPlan structure for local state
        setSchedule(INITIAL_SCHEDULE);
      } else {
        // Group flat data back into DayPlan structures
        const grouped = data.reduce((acc: Record<string, DayPlan>, task: any) => {
          if (!acc[task.date]) {
            acc[task.date] = { date: task.date, tasks: [], isRevisionDay: task.is_revision_day };
          }
          acc[task.date].tasks.push(task);
          return acc;
        }, {});
        setSchedule(Object.values(grouped));
      }
    } catch (err: any) {
      console.error("Supabase error:", err);
      setError("Sync failed. Check connection.");
      // Fallback to local storage if supabase fails
      const saved = localStorage.getItem('isneha_study_planner_v1');
      if (saved) setSchedule(JSON.parse(saved));
      else setSchedule(INITIAL_SCHEDULE);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleTask = async (dayIndex: number, taskId: string) => {
    const newSchedule = [...schedule];
    const day = newSchedule[dayIndex];
    const taskIndex = day.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex > -1) {
      const task = day.tasks[taskIndex];
      const newStatus = !task.completed;
      
      // Update local state first for snappy UI
      newSchedule[dayIndex].tasks[taskIndex].completed = newStatus;
      setSchedule(newSchedule);
      localStorage.setItem('isneha_study_planner_v1', JSON.stringify(newSchedule));

      // Sync to Supabase
      setIsSyncing(true);
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ completed: newStatus })
          .eq('id', taskId);
        if (error) throw error;
      } catch (err) {
        console.error("Sync error:", err);
        setError("Sync failed. Check connection.");
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const stats: UserStats = useMemo(() => {
    const allTasks = schedule.flatMap(d => d.tasks);
    return {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.completed).length,
      streak: 3 
    };
  }, [schedule]);

  const progressPercentage = Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0;

  const handleAskAI = async (taskDesc: string) => {
    setAiLoading(true);
    setActiveTab('ai');
    setAiResponse(null); // Clear previous
    const advice = await getStudyBuddyAdvice(taskDesc);
    setAiResponse(advice || "No advice found.");
    setAiLoading(false);
  };

  const TaskCard: React.FC<{ task: StudyTask, dayIndex: number }> = ({ task, dayIndex }) => (
    <div className={`group flex items-center p-4 mb-3 rounded-2xl border transition-all duration-300 ${task.completed ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
      <button 
        onClick={() => toggleTask(dayIndex, task.id)}
        className="mr-4 flex-shrink-0 transition-transform active:scale-75 p-1"
        aria-label="Toggle task completion"
      >
        {task.completed ? (
          <CheckCircle2 className="w-7 h-7 text-green-500 fill-green-50" />
        ) : (
          <Circle className="w-7 h-7 text-slate-300 group-hover:text-blue-400" />
        )}
      </button>
      <div className="flex-1 min-w-0" onClick={() => toggleTask(dayIndex, task.id)}>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${SUBJECT_COLORS[task.subject] || 'bg-gray-100'}`}>
            {task.subject}
          </span>
          {task.phase === 2 && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-red-100 text-red-700 border-red-200">
              Exam Mode
            </span>
          )}
        </div>
        <p className={`text-[15px] font-medium leading-tight ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
          {task.description}
        </p>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); handleAskAI(task.description); }}
        className="ml-2 p-3 rounded-xl bg-slate-50 text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all md:opacity-0 group-hover:opacity-100"
        title="Get AI Tips"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-100 pb-24 md:pb-0">
      {/* Sync Banner */}
      {error && (
        <div className="bg-amber-500 text-white text-[10px] py-1 px-4 text-center flex items-center justify-center gap-2 sticky top-0 z-[100]">
          <AlertCircle className="w-3 h-3" />
          {error}
          <button onClick={() => fetchData()} className="ml-2 underline font-bold">Retry Sync</button>
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">isneha</h1>
        </div>
        <div className="flex items-center gap-3">
          {isSyncing && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 active:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex h-screen overflow-hidden">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-0 right-0 z-[70] md:relative md:flex flex-col w-72 bg-white border-l md:border-l-0 md:border-r border-slate-100 transition-transform duration-300 ease-out shadow-2xl md:shadow-none ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                isneha's Hub
              </h1>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 rounded-xl hover:bg-slate-100">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <nav className="space-y-1.5">
              <button 
                onClick={() => { setActiveTab('daily'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'daily' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 font-bold' : 'text-slate-500 hover:bg-slate-50 font-medium'}`}
              >
                <Calendar className={`w-5 h-5 ${activeTab === 'daily' ? 'text-white' : 'text-slate-400'}`} />
                Daily Schedule
              </button>
              <button 
                onClick={() => { setActiveTab('stats'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'stats' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 font-bold' : 'text-slate-500 hover:bg-slate-50 font-medium'}`}
              >
                <Trophy className={`w-5 h-5 ${activeTab === 'stats' ? 'text-white' : 'text-slate-400'}`} />
                My Progress
              </button>
              <button 
                onClick={() => { setActiveTab('ai'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'ai' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 font-bold' : 'text-slate-500 hover:bg-slate-50 font-medium'}`}
              >
                <Sparkles className={`w-5 h-5 ${activeTab === 'ai' ? 'text-white' : 'text-slate-400'}`} />
                AI Study Buddy
              </button>
            </nav>
          </div>

          <div className="mt-auto p-6">
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Completion</span>
                <span className="text-sm font-black text-blue-600">{progressPercentage}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <p className="mt-6 text-[10px] text-center text-slate-400 font-medium">Syncing to Cloud Project: ivegh...</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10">
          {activeTab === 'daily' && (
            <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Today's Agenda</h2>
                  <p className="text-slate-500 font-medium">Jan 6 – Feb 5 Roadmap • Exam Mode Ready</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Cloud Connected</span>
                </div>
              </div>

              <div className="space-y-14">
                {schedule.map((day, dIdx) => (
                  <section key={day.date} className="relative">
                    <div className="flex items-center gap-5 mb-8">
                      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-3xl border-2 ${day.isRevisionDay ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}>
                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">{day.date.split(' ')[1]}</span>
                        <span className="text-2xl font-black leading-none">{day.date.split(' ')[0]}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">
                          {day.isRevisionDay ? 'Revision Marathon 🔥' : day.date}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 transition-all duration-500" 
                              style={{ width: `${(day.tasks.filter(t => t.completed).length / day.tasks.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">
                            {day.tasks.filter(t => t.completed).length}/{day.tasks.length} Complete
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {day.tasks.map((task) => (
                        <TaskCard key={task.id} task={task} dayIndex={dIdx} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
              <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Your Milestone Tracker</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: CheckCircle2, label: 'Tasks Done', value: stats.completedTasks, color: 'text-green-600', bg: 'bg-green-50' },
                  { icon: Trophy, label: 'Completion', value: `${progressPercentage}%`, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: ArrowUpRight, label: 'Study Streak', value: stats.streak, color: 'text-orange-600', bg: 'bg-orange-50' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-3xl flex items-center justify-center mb-6`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div className="text-5xl font-black text-slate-900 mb-2">{item.value}</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-5 leading-tight">Exam Season Ready!</h3>
                  <p className="text-blue-100 text-lg max-w-xl mb-10 font-medium leading-relaxed">
                    isneha, you're crushing your goals. Keep the momentum high as we approach Phase 2.
                  </p>
                  <button 
                    onClick={() => setActiveTab('daily')}
                    className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/20 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    Continue Studying
                  </button>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                  <Sparkles className="w-96 h-96" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="max-w-2xl mx-auto h-full flex flex-col animate-in slide-in-from-right-8 duration-700">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-blue-200">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Study Guide</h2>
                  <p className="text-slate-500 font-medium">Smart Insights • isneha's Assistant</p>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8">
                  {aiLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-6">
                      <div className="relative">
                         <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                         <Sparkles className="w-4 h-4 text-blue-300 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest animate-pulse">Consulting the study experts...</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="flex items-start gap-5">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-black text-xs shadow-inner">AI</div>
                        <div className="bg-slate-50/80 p-7 rounded-[2rem] text-slate-700 leading-relaxed border border-slate-100 shadow-sm">
                          <div className="prose prose-sm max-w-none whitespace-pre-wrap font-medium">
                            {aiResponse}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
                        <MessageCircle className="w-10 h-10 text-slate-300" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">Tap to Learn More</h3>
                      <p className="text-slate-500 text-sm max-w-xs font-medium">
                        Need help with a topic? Head back to the schedule and tap the sparkle icon on any task.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <div className="flex gap-2.5 flex-wrap justify-center">
                    {['Summarize Kathmandu', 'Factorization Tricks', 'Matter vs Atoms'].map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => handleAskAI(prompt)}
                        className="text-[11px] font-black uppercase tracking-wider bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Enhanced for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-slate-100 flex justify-around p-4 z-50 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {[
          { id: 'daily', icon: Calendar, label: 'Study' },
          { id: 'stats', icon: Trophy, label: 'Stats' },
          { id: 'ai', icon: Sparkles, label: 'AI' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)} 
            className={`px-6 py-2.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all active:scale-75 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
