import React from 'react';
import { FaBuilding, FaMicrochip, FaCogs, FaAward, FaRocket } from 'react-icons/fa';

const SuccessPath = () => {
    return (
        <section id="success-path" className="w-full max-w-[500px] relative pt-0 pb-12 overflow-visible">
            <div className="relative px-4">
                
                {/* Desktop/Tablet Viewport (Horizontal Path) */}
                <div className="hidden md:block relative w-full aspect-[2.4/1]">
                    {/* SVG Path Container */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                        <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 800 400"
                            fill="none"
                            preserveAspectRatio="none"
                        >
                            {/* Static Background Path */}
                            <path
                                d="M 120 350 Q 280 350 360 220 T 520 120 T 680 50"
                                stroke="#F1F5F9"
                                strokeWidth="6"
                                strokeLinecap="round"
                            />
                            
                            {/* Animated Glowing Path */}
                            <path
                                d="M 120 350 Q 280 350 360 220 T 520 120 T 680 50"
                                stroke="url(#pathGradient)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                className="animate-path-dash"
                                style={{ strokeDasharray: '30 120', strokeDashoffset: '150' }}
                            />

                            <defs>
                                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FB923C" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#F97316" />
                                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Desktop Station Nodes - Compact Percentages */}
                    <StationNode
                        label="Assessment"
                        icon={<FaBuilding />}
                        className="left-[15%] bottom-[12.5%]"
                    />
                    <StationNode
                        label="Practice"
                        icon={<FaMicrochip />}
                        className="left-[45%] bottom-[45%]"
                    />
                    <StationNode
                        label="Learning"
                        icon={<FaCogs className="animate-spin-slow" />}
                        className="left-[65%] bottom-[70%]"
                    />
                    <StationNode
                        label="Launch"
                        icon={<FaAward />}
                        className="left-[85%] bottom-[87.5%]"
                        isFinal
                    />
                </div>

                {/* Mobile Viewport (Vertical Stacking) */}
                <div className="md:hidden flex flex-col gap-10 relative pl-10">
                    <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-100 via-orange-500 to-orange-100 rounded-full" />
                    
                    <MobileStationNode
                        label="Assessment"
                        icon={<FaBuilding />}
                    />
                    <MobileStationNode
                        label="Practice"
                        icon={<FaMicrochip />}
                    />
                    <MobileStationNode
                        label="Learning"
                        icon={<FaCogs className="animate-spin-slow" />}
                    />
                    <MobileStationNode
                        label="Launch"
                        icon={<FaAward />}
                        isFinal
                    />
                </div>
            </div>

            <style>{`
                @keyframes flow {
                    to { stroke-dashoffset: -150; }
                }
                .animate-path-dash {
                    animation: flow 3s linear infinite;
                    filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.3));
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
};

const StationNode = ({ label, icon, className, isFinal }) => (
    <div className={`absolute -translate-x-1/2 flex flex-col items-center group transition-all duration-500 ${className}`}>
        {isFinal && (
            <div className="absolute -top-12 mb-2 animate-bounce">
                <span className="text-[8px] font-black text-white bg-orange-600 px-3 py-1 rounded-full shadow-md border border-orange-500 whitespace-nowrap">
                    YOUR PATH TO SUCCESS
                </span>
            </div>
        )}
        <div className={`
            ${isFinal ? 'w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-orange-600' : 'w-8 h-8 md:w-10 md:h-10 bg-white shadow-lg'} 
            rounded-[12px] md:rounded-[16px] flex items-center justify-center relative ring-2 md:ring-2 ring-orange-50 group-hover:ring-orange-100 transition-all duration-300 group-hover:-translate-y-1
        `}>
            <div className={`${isFinal ? 'text-white text-xl md:text-2xl' : 'text-orange-600 text-lg md:text-xl'}`}>
                {icon}
            </div>
        </div>
        <span className={`mt-2 text-[8px] md:text-[10px] font-black tracking-wider uppercase transition-colors duration-300 ${isFinal ? 'text-orange-600' : 'text-slate-400 group-hover:text-orange-500'}`}>
            {label}
        </span>
    </div>
);

const MobileStationNode = ({ label, icon, isFinal }) => (
    <div className="flex items-center gap-4 group">
        <div className={`
            ${isFinal ? 'w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600' : 'w-10 h-10 bg-white border border-orange-50'} 
            rounded-[14px] flex items-center justify-center relative shadow-md transition-transform duration-300 group-hover:scale-110
        `}>
            <div className={`${isFinal ? 'text-white text-xl' : 'text-orange-600 text-lg'}`}>
                {icon}
            </div>
        </div>
        <div className="flex flex-col">
            {isFinal && <span className="text-[8px] font-black text-orange-500 mb-0.5 leading-none uppercase">Your Path</span>}
            <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${isFinal ? 'text-orange-600' : 'text-slate-500'}`}>
                {label}
            </span>
        </div>
    </div>
);

export default SuccessPath;
