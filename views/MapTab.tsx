
import React, { useState, useRef, useEffect } from 'react';
import { UserData } from '../types';
import { CITY_INFO } from '../data/world';
import { NeonButton } from '../components/SharedUI';
import { MapPin, Navigation, Locate, AlertTriangle, Plane, Lock, Globe, Plus, Minus, Maximize, Scan, X } from 'lucide-react';
import mapBg from '../components/cirmson_map.png';

interface MapTabProps {
  currentUser: UserData | null;
  handleTravel: (targetCity: string, cost: { energy: number, credits: number }) => void;
}

// Map Configuration
const MAP_WIDTH = 2560;
const MAP_HEIGHT = 1440;

const CITIES = [
  // Northern Region
  { name: '白鲸市', x: 1864, y: 358, region: 'northern', level: 3, risk: 'HIGH' },
  { name: '临荫市', x: 1680, y: 418, region: 'northern', level: 2, risk: 'LOW' },
  
  // Western Wasteland / Gap Fillers

  { name: '蓝柯市', x: 1044, y: 654, region: 'western', level: 2, risk: 'MED' },
  { name: '多玛市', x: 616, y: 800, region: 'wasteland', level: 4, risk: 'EXTREME' },

  // Central Federation
  { name: '联邦行政中心', x: 1544, y: 535, region: 'central', level: 3, risk: 'MED' },
  { name: '浮岗市', x: 1620, y: 605, region: 'central', level: 2, risk: 'LOW' },
  { name: '鸣山市', x: 1700, y: 605, region: 'central', level: 2, risk: 'LOW' },
  { name: '黑海市', x: 1561, y: 715, region: 'central', level: 1, risk: 'HIGH' },
  // Eastern

{ name: '赤余市', x: 2250, y: 710, region: 'eastern', level: 3, risk: 'HIGH' },
  

];

// Connection Routes for Dashed Lines
const ROUTES = [
    ['黑海市', '联邦行政中心'],
    ['黑海市', '浮岗市'],
    ['联邦行政中心', '蓝柯市'],
    ['蓝柯市', '多玛市'],
    ['黑海市', '蓝柯市'],
    ['联邦行政中心', '临荫市'],
    ['临荫市', '白鲸市'],
    ['白鲸市', '鸣山市'],
    ['白鲸市', '赤余市']
];

export const MapTab: React.FC<MapTabProps> = ({ currentUser, handleTravel }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [minScale, setMinScale] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);

  const currentCityData = CITIES.find(c => c.name === currentUser?.currentLocation);
  const targetCityData = CITIES.find(c => c.name === selectedCity);

  const calculateDistance = (c1: typeof targetCityData, c2: typeof currentCityData) => {
    if (!c1 || !c2) return 0;
    return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)) / 5;
  };

  const dist = calculateDistance(targetCityData, currentCityData);
  const travelCost = {
    energy: Math.floor(dist * 0.1),
    credits: Math.floor(dist * 0.5)
  };

  // --- Map Interaction Handlers ---

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleSensitivity = 0.001;
    // Limit min scale to the calculated fit-height scale
    const newScale = Math.min(Math.max(minScale, transform.scale - e.deltaY * scaleSensitivity), 3);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.city-node')) return; // Don't drag if clicking a city
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setTransform(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleZoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 3) }));
  const handleZoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, minScale) }));
  
  const handleReset = () => {
    if (containerRef.current) {
        const { clientHeight, clientWidth } = containerRef.current;
        const fitHeightScale = clientHeight / MAP_HEIGHT;
        
        // If we want to center on current city, we calculate offset
        if (currentCityData) {
            setTransform({ 
                x: -currentCityData.x * fitHeightScale + clientWidth / 2, 
                y: -currentCityData.y * fitHeightScale + clientHeight / 2, 
                scale: fitHeightScale 
            });
        } else {
            // Default center
            setTransform({
                x: (clientWidth - MAP_WIDTH * fitHeightScale) / 2,
                y: 0,
                scale: fitHeightScale
            });
        }
    }
  };

  // Initialization: Fit to height
  useEffect(() => {
    const initMap = () => {
        if (containerRef.current) {
            const { clientHeight, clientWidth } = containerRef.current;
            const fitHeightScale = clientHeight / MAP_HEIGHT;
            setMinScale(fitHeightScale);
            
            // Set initial view centered or fitted
            setTransform({
                x: (clientWidth - MAP_WIDTH * fitHeightScale) / 2,
                y: 0, 
                scale: fitHeightScale
            });
        }
    };
    
    initMap();
    window.addEventListener('resize', initMap);
    return () => window.removeEventListener('resize', initMap);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0a] select-none group">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,0.5)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

       {/* Map Container */}
       <div 
         ref={containerRef}
         className="w-full h-full cursor-move active:cursor-grabbing"
         onWheel={handleWheel}
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
       >
         <div 
            style={{ 
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                width: MAP_WIDTH,
                height: MAP_HEIGHT
            }}
            className="relative"
         >
            {/* World Background Image */}
            <img 
              src={mapBg}
              alt="World Map" 
              className="absolute top-0 left-0 w-[2560px] h-[1440px] object-cover opacity-60 pointer-events-none" 
              draggable={false}
              onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Fallback Shape if image missing or loading */}
            <div className="absolute top-0 left-0 w-[2560px] h-[1440px] opacity-10 pointer-events-none border border-zinc-800 bg-zinc-900/50 -z-10"></div>

            {/* --- SVG Layer for Connection Lines --- */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                {ROUTES.map(([start, end], i) => {
                    const s = CITIES.find(c => c.name === start);
                    const e = CITIES.find(c => c.name === end);
                    if (!s || !e) return null;
                    return (
                        <line 
                            key={i} 
                            x1={s.x} y1={s.y} x2={e.x} y2={e.y} 
                            stroke="#facc15" // yellow-400
                            strokeWidth="2" 
                            strokeDasharray="8 8" 
                            className="opacity-80"
                        />
                    );
                })}
            </svg>

            {/* --- Cities --- */}
            {CITIES.map(city => {
                const isCurrent = city.name === currentUser?.currentLocation;
                const isSelected = city.name === selectedCity;
                
                return (
                    <div 
                        key={city.name}
                        className={`city-node absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/city z-10`}
                        style={{ left: city.x, top: city.y }}
                        onClick={(e) => { e.stopPropagation(); setSelectedCity(city.name); }}
                    >
                        {/* City Marker */}
                        <div className={`relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-150' : 'group-hover/city:scale-125'}`}>
                             {/* Ripple Effect for Current Location */}
                             {isCurrent && (
                                <div className="absolute w-20 h-20 bg-emerald-500/20 rounded-full animate-ping"></div>
                             )}
                             
                             {/* Icon Circle */}
                             <div className={`
                                w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-[0_0_15px_black]
                                ${isCurrent ? 'bg-emerald-900 border-emerald-500 text-emerald-500' : 
                                  isSelected ? 'bg-red-900 border-red-500 text-red-500' : 'bg-black border-zinc-600 text-zinc-600'}
                             `}>
                                 {isCurrent ? <Navigation size={14} className="fill-current" /> : <div className="w-2 h-2 bg-current rounded-full"></div>}
                             </div>

                             {/* Label */}
                             <div className={`absolute top-10 text-[10px] whitespace-nowrap px-2 py-1 bg-black/80 border rounded backdrop-blur-sm transition-colors
                                ${isCurrent ? 'border-emerald-500 text-emerald-500' : 
                                  isSelected ? 'border-red-500 text-red-500' : 'border-zinc-700 text-zinc-500'}
                             `}>
                                 {city.name}
                             </div>
                        </div>
                    </div>
                );
            })}
         </div>
       </div>

       {/* --- Map HUD Overlay --- */}
       <div className="absolute top-6 left-6 pointer-events-none z-20">
            <h2 className="text-3xl font-black font-orbitron text-white tracking-widest uppercase drop-shadow-md">
                WORLD MAP <span className="text-red-600 text-sm align-top">V.2.1</span>
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-black/50 px-2 py-1 border-l-2 border-red-500">
                <Globe size={12} />
                COORD: {Math.round(-transform.x)}, {Math.round(-transform.y)}
            </div>
       </div>

       {/* --- Collapsible Info Panel (Right Side) --- */}
       <div 
         className={`absolute top-0 right-0 h-full w-full md:w-96 bg-black/95 border-l border-zinc-800 p-8 z-30 transform transition-transform duration-300 ease-in-out shadow-2xl ${selectedCity ? 'translate-x-0' : 'translate-x-full'}`}
       >
            {targetCityData ? (
                <div className="h-full flex flex-col">
                    <button 
                        onClick={() => setSelectedCity(null)}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="border-b border-zinc-800 pb-6 mb-6">
                        <div className="text-[10px] text-red-500 font-bold tracking-[0.3em] uppercase mb-2">Target Locked</div>
                        <h2 className="text-3xl font-bold text-white font-orbitron tracking-widest">{targetCityData.name}</h2>
                        <div className="flex gap-2 mt-3">
                            <span className={`text-[10px] px-2 py-0.5 border ${targetCityData.risk === 'LOW' ? 'border-emerald-600 text-emerald-500' : targetCityData.risk === 'MED' ? 'border-yellow-600 text-yellow-500' : 'border-red-600 text-red-500'}`}>
                                RISK: {targetCityData.risk}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 border border-zinc-700 text-zinc-500">
                                LV.{targetCityData.level} ACCESS
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto">
                        <div className="text-sm text-zinc-400 leading-relaxed font-serif italic border-l-2 border-zinc-800 pl-4">
                            {CITY_INFO[targetCityData.name] || "暂无该区域详细情报。建议谨慎探索。"}
                        </div>

                        {currentUser?.currentLocation !== targetCityData.name ? (
                            <div className="bg-zinc-900/50 p-4 border border-zinc-800">
                                <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Plane size={12} /> 行程评估
                                </h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-[10px] text-zinc-600">距离</div>
                                        <div className="text-lg font-mono text-white">{Math.floor(dist)} km</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-600">预计耗时</div>
                                        <div className="text-lg font-mono text-white">{Math.ceil(dist / 50)} h</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-600">体力消耗</div>
                                        <div className={`text-lg font-mono ${currentUser && currentUser.energy < travelCost.energy ? 'text-red-500' : 'text-emerald-500'}`}>
                                            -{travelCost.energy}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-600">路费</div>
                                        <div className={`text-lg font-mono ${currentUser && currentUser.credits < travelCost.credits ? 'text-red-500' : 'text-yellow-500'}`}>
                                            -{travelCost.credits} CR
                                        </div>
                                    </div>
                                </div>
                                
                                <NeonButton 
                                    variant="red" 
                                    className="w-full h-12"
                                    onClick={() => handleTravel(targetCityData.name, travelCost)}
                                    disabled={!currentUser || currentUser.energy < travelCost.energy || currentUser.credits < travelCost.credits}
                                >
                                    {(!currentUser || currentUser.energy < travelCost.energy) ? "体力不足" : 
                                     currentUser.credits < travelCost.credits ? "信用点不足" : "确认前往"}
                                </NeonButton>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-900/10 border border-emerald-900/30 text-emerald-500 text-center text-sm font-bold">
                                当前所在地
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-zinc-600 text-xs tracking-widest">
                    NO TARGET SELECTED
                </div>
            )}
       </div>

       {/* --- Map Controls --- */}
       <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
            <button onClick={handleReset} className="bg-black/80 hover:bg-red-900/50 text-white p-2 border border-zinc-700 hover:border-red-500 transition-colors" title="Locate Self">
                <Locate size={20} />
            </button>
            <div className="flex flex-col bg-black/80 border border-zinc-700">
                <button onClick={handleZoomIn} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 border-b border-zinc-700"><Plus size={20}/></button>
                <button onClick={handleZoomOut} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800"><Minus size={20}/></button>
            </div>
       </div>
    </div>
  );
};
