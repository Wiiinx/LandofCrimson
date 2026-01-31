
import React, { useRef, useEffect } from 'react';
import { UserData, Contact } from '../types';
import { MOCK_CONTACTS, NPC_DB } from '../data/npcs';
import { MessageSquare, Send, User, ShieldCheck, ArrowLeft, Signal } from 'lucide-react';
import { NeonButton } from '../components/SharedUI';

interface SocialTabProps {
  currentUser: UserData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  selectedContact: Contact | null;
  setSelectedContact: (c: Contact | null) => void;
  handleSendMessage: () => void;
  handleTransferItem: () => void;
  chatInput: string;
  setChatInput: (val: string) => void;
  selectedGiftId: string;
  setSelectedGiftId: (val: string) => void;
}

export const SocialTab: React.FC<SocialTabProps> = ({ 
  currentUser, selectedContact, setSelectedContact, 
  handleSendMessage, handleTransferItem, chatInput, setChatInput,
  selectedGiftId, setSelectedGiftId 
}) => {
  const allContacts: Contact[] = [
    ...MOCK_CONTACTS,
    ...NPC_DB.map(npc => ({
      id: npc.id,
      name: npc.name,
      type: 'npc' as const,
      status: 'online' as const,
      avatarColor: npc.avatarColor,
      desc: npc.title
    }))
  ];

  const currentConversation = selectedContact && currentUser?.conversations[selectedContact.id] ? currentUser.conversations[selectedContact.id] : [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [currentConversation]);

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'online': return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
        case 'busy': return 'bg-amber-500';
        default: return 'bg-zinc-700';
    }
  };

  const getStatusText = (status: string) => {
      switch(status) {
          case 'online': return '在线';
          case 'busy': return '忙碌';
          default: return '离线';
      }
  };

  return (
    <div className="flex h-full gap-0 lg:gap-6 relative overflow-hidden bg-black/20">
      
      {/* --- LEFT COLUMN: CONTACT LIST --- */}
      <div className={`w-full lg:w-80 flex flex-col h-[calc(100vh-140px)] shrink-0 ${selectedContact ? 'hidden lg:flex' : 'flex'}`}>
        <div className="mb-2 px-1 flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
              <User size={16} /> 联系人 ({allContacts.length})
            </h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-1 pb-20">
            {allContacts.map(contact => {
                const isSelected = selectedContact?.id === contact.id;
                return (
                <div key={contact.id} onClick={() => setSelectedContact(contact)} className="cursor-pointer group">
                    <div className={`flex items-center gap-3 p-3 rounded transition-colors ${isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-900 border-b border-zinc-900'}`}>
                        {/* Avatar (Simplified) */}
                        <div className="relative shrink-0">
                            <div className={`w-10 h-10 rounded bg-black flex items-center justify-center overflow-hidden border border-zinc-800 ${contact.status === 'online' ? 'shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]' : ''}`}>
                                {contact.status === 'online' ? (
                                    <Signal size={18} className="text-emerald-500 animate-pulse" />
                                ) : (
                                    <User size={18} className="text-zinc-700" />
                                )}
                            </div>
                            {/* Status Dot */}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black ${getStatusColor(contact.status)}`}></div>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <div className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                    {contact.name}
                                </div>
                                {contact.type === 'npc' && <ShieldCheck size={12} className="text-blue-500" />}
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 truncate max-w-[120px]">{contact.desc || "..."}</span>
                                <span className={`scale-90 ${contact.status === 'online' ? 'text-emerald-600' : 'text-zinc-600'}`}>
                                    {getStatusText(contact.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
      </div>

      {/* --- RIGHT COLUMN: CHAT AREA --- */}
      <div className={`flex-1 flex flex-col h-[calc(100vh-140px)] border-l border-zinc-800 lg:bg-zinc-900/10 ${!selectedContact ? 'hidden lg:flex' : 'flex'}`}>
            {selectedContact ? (
                <>
                {/* Chat Header */}
                <div className="p-3 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden text-zinc-400 hover:text-white p-1" onClick={() => setSelectedContact(null)}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="font-bold text-zinc-200 text-sm md:text-base">{selectedContact.name}</div>
                            <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(selectedContact.status)}`}></span>
                                {getStatusText(selectedContact.status)}
                            </div>
                        </div>
                    </div>
                    
                    {/* Item Transfer */}
                    <div className="flex items-center gap-2">
                         <select 
                            className="bg-black text-xs text-zinc-300 border border-zinc-700 rounded px-2 py-1 outline-none w-28 md:w-40"
                            value={selectedGiftId}
                            onChange={(e) => setSelectedGiftId(e.target.value)}
                         >
                            <option value="">选择物品...</option>
                            {currentUser?.inventory.map((item, idx) => (
                                <option key={`${item.id}_${idx}`} value={item.id}>{item.name} x{item.count}</option>
                            ))}
                         </select>
                         <button 
                            onClick={handleTransferItem} 
                            disabled={!selectedGiftId} 
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 text-xs rounded border border-zinc-700 transition-colors disabled:opacity-50"
                         >
                            发送
                         </button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40" ref={scrollRef}>
                    {currentConversation.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50">
                            <MessageSquare size={32} className="mb-2" />
                            <div className="text-xs">暂无聊天记录</div>
                        </div>
                    )}
                    
                    {currentConversation.map((msg) => {
                        const isMe = msg.sender === 'me';
                        const isSys = msg.sender === 'system';
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    {isSys ? (
                                        <div className="w-full text-center text-xs text-zinc-500 my-2 px-4 py-1 bg-zinc-900/50 rounded-full">
                                            {msg.content}
                                        </div>
                                    ) : (
                                        <>
                                        <div className={`
                                            px-3 py-2 text-sm rounded-lg leading-relaxed shadow-sm
                                            ${isMe 
                                                ? 'bg-zinc-700 text-white rounded-tr-none' 
                                                : 'bg-zinc-800 text-zinc-200 rounded-tl-none'}
                                        `}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-zinc-600 mt-1 mx-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-3 bg-zinc-900 border-t border-zinc-800 shrink-0">
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                            placeholder="输入消息..."
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        />
                        <NeonButton onClick={handleSendMessage} variant="zinc" className="px-4">
                            <Send size={16} />
                        </NeonButton>
                    </div>
                </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 bg-zinc-900/20">
                    <MessageSquare size={48} className="mb-4 opacity-20" />
                    <div className="text-sm">请选择一个联系人开始聊天</div>
                </div>
            )}
      </div>
    </div>
  );
};
