
import React from 'react';
import { Crosshair, LogOut, User, Briefcase, Users, MessageSquare, ShoppingCart, Terminal as TerminalIcon, Compass, Map as MapIcon, Hexagon, Power } from 'lucide-react';
import { ForumPost } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setViewingPost: (post: ForumPost | null) => void;
  setView: (view: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, setViewingPost, setView }) => {
  const menuItems = [
    { id: 'dashboard', icon: User, label: '个人', sub: 'IDENTITY' },
    { id: 'exploration', icon: Compass, label: '探索', sub: 'ZONE_SCAN' },
    { id: 'map', icon: MapIcon, label: '地图', sub: 'NAVIGATION' },
    { id: 'missions', icon: Briefcase, label: '主线', sub: 'CONTRACTS' },
    { id: 'social', icon: Users, label: '联系人', sub: 'NETWORK' },
    { id: 'forum', icon: MessageSquare, label: '论坛', sub: 'FORUMS' },
    { id: 'market', icon: ShoppingCart, label: '黑市', sub: 'BLACK_MKT' },
    { id: 'terminal', icon: TerminalIcon, label: '系统', sub: 'SYSTEM_LOG' },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (High-Tech Vertical) --- */}
      <nav className="hidden md:flex flex-col w-24 hover:w-64 h-screen fixed left-0 top-0 bg-black/95 border-r border-zinc-800 z-50 transition-all duration-300 group overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-[1px] bg-zinc-800 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
        
        {/* Moving Scanner Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-scanline pointer-events-none z-0"></div>

        {/* --- ORIGIN POINT (Top) --- */}
        <div className="relative h-24 flex items-center justify-center shrink-0 border-b border-zinc-800/50">
           <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border border-red-900 rotate-45 animate-pulse"></div>
              <div className="absolute inset-0 border border-red-900 -rotate-45 animate-pulse delay-75"></div>
              <Crosshair size={24} className="text-red-600 relative z-10" />
           </div>
           {/* Unfolding Line */}
           <div className="absolute bottom-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent to-red-900/50 -z-10"></div>
        </div>

        {/* --- MENU ITEMS --- */}
        <div className="flex-1 flex flex-col justify-center py-4 space-y-2 relative">
           {/* Vertical Connector Line */}
           <div className="absolute left-[3rem] top-4 bottom-4 w-[1px] bg-zinc-800/50 hidden group-hover:block transition-opacity duration-500"></div>

           {menuItems.map((item, index) => {
             const isActive = activeTab === item.id;
             return (
               <button 
                 key={item.id}
                 onClick={() => { setActiveTab(item.id); setViewingPost(null); }}
                 className={`
                    relative flex items-center h-12 px-4 mx-2 transition-all duration-300
                    ${isActive ? 'text-white' : 'text-zinc-500 hover:text-red-400'}
                 `}
                 style={{ 
                   animation: `slideIn 0.3s ease-out forwards ${index * 0.05}s`,
                   opacity: 0,
                   transform: 'translateX(-20px)' 
                 }}
               >
                 {/* Active Background Shape */}
                 {isActive && (
                    <div className="absolute inset-0 bg-red-900/20 border-l-2 border-red-500 shadow-[inset_10px_0_20px_rgba(220,38,38,0.1)]"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}></div>
                 )}
                 
                 {/* Hover Connector (Visual line from icon to text) */}
                 <div className="absolute left-8 top-1/2 w-4 h-[1px] bg-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                 {/* Icon Container */}
                 <div className={`
                    relative z-10 w-10 h-10 flex items-center justify-center shrink-0 transition-transform duration-300
                    ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                 `}>
                    <item.icon size={20} className={isActive ? 'text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : ''} />
                    
                    {/* Tiny decorative corners for icon */}
                    {isActive && (
                        <>
                            <div className="absolute top-1 left-1 w-1 h-1 bg-red-500"></div>
                            <div className="absolute bottom-1 right-1 w-1 h-1 bg-red-500"></div>
                        </>
                    )}
                 </div>

                 {/* Text Label (Reveals on Hover) */}
                 <div className="flex flex-col items-start ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap overflow-hidden">
                    <span className="font-orbitron font-bold tracking-widest text-sm">{item.label}</span>
                    <span className="text-[9px] font-mono text-zinc-600 tracking-[0.2em]">{item.sub}</span>
                 </div>

                 {/* Index Number */}
                 <div className="absolute right-2 text-[9px] font-mono text-zinc-800 group-hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    0{index + 1}
                 </div>
               </button>
             );
           })}
        </div>

        {/* --- BOTTOM STATUS --- */}
        <div className="p-4 border-t border-zinc-800 bg-black relative">
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 tracking-widest">SYSTEM STATUS</span>
                    <span className="text-[10px] text-emerald-500 font-mono">ONLINE // V2.4</span>
                </div>
            </div>
            
            <button 
                onClick={() => setView('login')}
                className="mt-4 w-full flex items-center justify-center gap-2 p-2 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-900 transition-colors group/btn"
            >
                <Power size={16} />
                <span className="text-xs font-bold hidden group-hover:inline-block">DISCONNECT</span>
            </button>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAV (Simplified but styled) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/95 border-t border-zinc-800 z-50 px-2 pb-safe">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        <div className="flex justify-between items-center py-2">
           {menuItems.slice(0, 5).map((item) => (
             <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setViewingPost(null); }}
                className={`p-3 flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-red-500' : 'text-zinc-600'}`}
             >
                <item.icon size={20} />
                <span className="text-[8px] font-bold tracking-wider">{item.label}</span>
             </button>
           ))}
           <button onClick={() => setView('login')} className="p-3 text-zinc-700">
               <LogOut size={20} />
           </button>
        </div>
      </nav>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes slideIn {
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scanline {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </>
  );
};
