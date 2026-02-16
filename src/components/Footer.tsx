"use client";

import { useEffect, useState } from "react";
import { Activity, Server, Globe, Clock, Shield, Wifi } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
    const [time, setTime] = useState("");
    const [serverLoad, setServerLoad] = useState(32);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);

        // Simulate fluctuating server load
        const loadInterval = setInterval(() => {
            setServerLoad(prev => Math.min(99, Math.max(10, prev + (Math.random() - 0.5) * 10)));
        }, 2000);

        return () => {
            clearInterval(interval);
            clearInterval(loadInterval);
        };
    }, []);

    return (
        <footer className="bg-slate-950 border-t border-slate-800/50 pt-20 pb-10 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 bg-[length:30px_30px] pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="grid md:grid-cols-12 gap-12 mb-20 border-b border-slate-800/50 pb-12">
                    {/* Brand Column */}
                    <div className="col-span-12 md:col-span-4 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                                <span className="text-white font-black text-xl tracking-tighter">S</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black tracking-tighter text-white leading-tight">SNPE</span>
                                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em]">System Online</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                            Define Absolute Precision.<br />
                            Total Engineering Solution for Smart Manufacturing.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 flex items-center gap-2 text-[10px] text-slate-400">
                                <Shield size={12} className="text-green-400" /> Security Lvl. 5
                            </div>
                            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 flex items-center gap-2 text-[10px] text-slate-400">
                                <Wifi size={12} className="text-blue-400" /> Network Secure
                            </div>
                        </div>
                    </div>

                    {/* System Status Panel (Center) */}
                    <div className="col-span-12 md:col-span-5 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm">
                        <div className="text-[10px] font-mono text-slate-500 mb-4 tracking-widest flex justify-between items-center">
                            <span>SYSTEM METRICS</span>
                            <span className="text-green-500 animate-pulse">● LIVE</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Server size={14} /> Server Load
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-500"
                                        animate={{ width: `${serverLoad}%` }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                    />
                                </div>
                                <div className="text-right text-[10px] font-mono text-blue-300">{Math.round(serverLoad)}%</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Globe size={14} /> Global Traffic
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <motion.div
                                            key={i}
                                            className="flex-1 h-6 bg-slate-800 rounded-sm"
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                            style={{ backgroundColor: i < 5 ? '#0ea5e9' : '#334155' }}
                                        />
                                    ))}
                                </div>
                                <div className="text-right text-[10px] font-mono text-cyan-300">OPTIMAL</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div className="col-span-12 md:col-span-3 space-y-4 md:pl-8">
                        <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">HQ COORDINATES</h4>
                        <div className="text-sm text-slate-300 font-light">
                            Daejeon, South Korea<br />
                            Techno 4-ro 17, A-416
                        </div>
                        <div className="flex items-center gap-2 text-lg font-mono text-white">
                            <Clock size={16} className="text-blue-500" />
                            {time}
                        </div>
                        <div className="text-[10px] text-slate-500">UTC+09:00 Seoul</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 font-mono">
                    <div>© 2026 SNPE INC. ALL SYSTEMS OPERATIONAL.</div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span className="hover:text-blue-400 cursor-pointer transition-colors">PRIVACY PROTOCOL</span>
                        <span className="hover:text-blue-400 cursor-pointer transition-colors">TERMS OF SERVICE</span>
                        <span className="hover:text-blue-400 cursor-pointer transition-colors">SECURITY AUDIT</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

