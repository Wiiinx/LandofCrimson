
import React, { useState } from 'react';
import { UserData, Mission, ActiveMission, InventoryItem } from '../types';
import { MISSION_DB } from '../data/missions';
import { NeonButton, CyberFrame } from '../components/SharedUI';
import { Activity, Clock, Search, Box, ChevronUp, ChevronDown } from 'lucide-react';
import { getRarityBorder } from '../utils/styling';
import { SellModal } from '../components/Modals';

interface ExplorationTabProps {
  currentUser: UserData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  startMission: (mission: Mission) => void;
  completeMission: (active: ActiveMission) => void;
  handleScavenge: () => void;
  isScavenging: boolean;
  handleUseItem: (id: string) => void;
  handleSellItem: (item: InventoryItem, quantity: number) => void;
  onShowInfo: (e: React.MouseEvent, title: string, content: string) => void;
  onHideInfo: () => void;
}

export const ExplorationTab: React.FC<ExplorationTabProps> = ({ 
    currentUser, startMission, completeMission, 
    handleScavenge, isScavenging, 
    handleUseItem, handleSellItem,
    onShowInfo, onHideInfo
}) => {
  const [sellingItem, setSellingItem] = useState<InventoryItem | null>(null);

  const confirmSell = (qty: number) => {
    if (sellingItem) {
      handleSellItem(sellingItem, qty);
      setSellingItem(null);
    }
  };

  // Filter for Daily Missions
  const activeDailyMissions = currentUser?.activeMissions.filter(am => {
      const m = MISSION_DB.find(dbM => dbM.id === am.missionId);
      return m && m.category === 'daily';
  }) || [];

  const availableDailyMissions = MISSION_DB.filter(m => {
    if (m.category !== 'daily') return false;
    if (activeDailyMissions.some(am => am.missionId === m.id)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-8 h-full">
        
        {/* --- Top: Quick Status & Area Exploration --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-black/40 border border-zinc-800 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,0,0,0.05)_50%,transparent_75%,transparent_100%)] bg-[size:20px_20px]"></div>
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold font-orbitron text-red-500 tracking-widest uppercase">区域探索</h2>
                        <div className="text-[10px] text-zinc-500">ZONE: {currentUser?.birthplace}</div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-zinc-400 space-y-1">
                        <div>SAN: <span className={currentUser!.san < 30 ? "text-red-500" : "text-emerald-500"}>{currentUser?.san}</span> / {currentUser?.maxSan}</div>
                        <div>ENG: <span className={currentUser!.energy < 30 ? "text-red-500" : "text-emerald-500"}>{currentUser?.energy}</span> / {currentUser?.maxEnergy}</div>
                    </div>
                </div>

                <NeonButton variant="red" onClick={handleScavenge} disabled={isScavenging} className="h-16 w-full text-sm">
                    {isScavenging ? <Activity className="animate-spin mr-3" size={18}/> : <Search className="mr-3" size={18}/>}
                    开始搜寻 (-10 ENG / -5 SAN)
                </NeonButton>
            </div>

            {/* Daily Routines List */}
            <div className="md:col-span-4 space-y-3">
                 <h3 className="text-xs text-zinc-500 font-bold uppercase tracking-widest border-b border-zinc-800 pb-2">
                     日常事务 / Routines
                 </h3>
                 <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                    {/* Active Dailies */}
                    {activeDailyMissions.map(am => {
                         const m = MISSION_DB.find(dbM => dbM.id === am.missionId)!;
                         const isComplete = Date.now() >= am.endTime;
                         const timeLeft = Math.max(0, Math.ceil((am.endTime - Date.now()) / 1000));
                         
                         return (
                            <div key={am.missionId} className="bg-zinc-900 border border-zinc-700 p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-bold text-white">{m.title}</div>
                                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                                        <Clock size={10} /> {isComplete ? '完成' : `${timeLeft}s`}
                                    </div>
                                </div>
                                <NeonButton 
                                    variant={isComplete ? 'green' : 'zinc'} 
                                    disabled={!isComplete} 
                                    onClick={() => completeMission(am)}
                                    className="px-2 py-1 text-[9px]"
                                >
                                    {isComplete ? '结算' : '...'}
                                </NeonButton>
                            </div>
                         );
                    })}

                    {/* Available Dailies */}
                    {availableDailyMissions.map(m => (
                        <div key={m.id} className="bg-black/50 border border-zinc-800 p-3 flex justify-between items-center hover:border-zinc-600 transition-colors">
                            <div>
                                <div className="text-sm font-bold text-zinc-300">{m.title}</div>
                                <div className="text-[10px] text-zinc-600">
                                   -{m.cost.credits} CR 恢复状态
                                </div>
                            </div>
                            <button 
                                onClick={() => startMission(m)}
                                className="text-[10px] text-zinc-500 hover:text-white border border-zinc-800 px-2 py-1 hover:bg-zinc-800"
                            >
                                执行
                            </button>
                        </div>
                    ))}
                 </div>
            </div>
        </div>

        {/* --- Bottom: Inventory --- */}
        <div className="flex-1 bg-zinc-900/20 border-t border-zinc-800 p-6 flex flex-col min-h-0">
             <div className="flex justify-between items-center mb-6 text-xs text-zinc-500 uppercase tracking-widest shrink-0">
                 <div className="flex items-center gap-2">
                    <Box size={14} />
                    <span>物资背包 / INVENTORY</span>
                 </div>
                 <span>{currentUser?.inventory.length} / 50</span>
             </div>
             
             <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {currentUser?.inventory.map((item, idx) => (
                    <div key={`${item.id}_${idx}`} className={`p-3 border bg-black flex flex-col justify-between gap-2 ${getRarityBorder(item.rarity)}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div 
                                    className="text-sm text-white font-bold cursor-help"
                                    onMouseEnter={(e) => onShowInfo(e, item.name, item.desc)}
                                    onMouseLeave={onHideInfo}
                                >
                                    {item.name}
                                </div>
                                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">x{item.count}</div>
                            </div>
                            <div className="text-[9px] text-zinc-600 uppercase border border-zinc-800 px-1">{item.type}</div>
                        </div>
                        
                        <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-900">
                            {item.type === 'consumable' && (
                                <button onClick={() => handleUseItem(item.id)} className="flex-1 text-[10px] bg-emerald-900/20 text-emerald-500 hover:bg-emerald-900/40 py-1 text-center font-bold">
                                    使用
                                </button>
                            )}
                            {item.type !== 'gear' && (
                                <button onClick={() => setSellingItem(item)} className="flex-1 text-[10px] bg-zinc-900 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 py-1 text-center">
                                    出售
                                </button>
                            )}
                        </div>
                    </div>
                    ))}
                    {currentUser?.inventory.length === 0 && (
                        <div className="col-span-full text-center text-[10px] text-zinc-700 py-12 border border-zinc-800 border-dashed">
                            背包空空如也。去探索一番吧。
                        </div>
                    )}
                </div>
             </div>
        </div>

        {sellingItem && <SellModal item={sellingItem} onClose={() => setSellingItem(null)} onConfirm={confirmSell} />}
    </div>
  );
};
