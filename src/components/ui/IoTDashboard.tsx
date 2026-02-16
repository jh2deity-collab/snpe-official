"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, Thermometer, Zap, AlertCircle, RefreshCw, Leaf, Wind } from "lucide-react";

interface IoTDashboardProps {
    data: any[];
    healingStatus: "stable" | "anomaly" | "healing";
}

export default function IoTDashboard({ data, healingStatus }: IoTDashboardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full p-4 overflow-y-auto scrollbar-none">
            {/* Sensor Status Header */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-between bg-slate-900/50 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                    <Activity className={`w-5 h-5 ${healingStatus === "stable" ? "text-cyan-400" : healingStatus === "healing" ? "text-yellow-400 animate-spin" : "text-red-500 animate-pulse"}`} />
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">IoT Cluster Status</div>
                        <div className={`text-sm font-black uppercase ${healingStatus === "stable" ? "text-cyan-400" : healingStatus === "healing" ? "text-yellow-400" : "text-red-500"}`}>
                            {healingStatus === "stable" ? "OPERATIONAL" : healingStatus === "healing" ? "SELF-HEALING IN PROGRESS..." : "ANOMALY DETECTED"}
                        </div>
                    </div>
                </div>
                {healingStatus === "anomaly" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 px-3 py-1.5 rounded-lg text-red-400 text-[10px] font-bold"
                    >
                        <AlertCircle size={14} />
                        CRITICAL VIBRATION SPIKE
                    </motion.div>
                )}
            </div>

            {/* Vibration Trend */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 min-h-[180px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        <Activity size={14} className="text-blue-400" />
                        Vibration (Hz)
                    </div>
                    <span className="text-[13px] font-mono text-blue-400">{data[data.length - 1]?.vibration?.toFixed(1) || 0} Hz</span>
                </div>
                <div className="flex-1 min-h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="vibration"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorVib)"
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Temperature Trend */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 min-h-[180px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-200 uppercase tracking-tighter">
                        <Thermometer size={14} className="text-orange-400" />
                        Thermal (°C)
                    </div>
                    <span className="text-[13px] font-mono text-orange-400">{data[data.length - 1]?.temp?.toFixed(1) || 0} °C</span>
                </div>
                <div className="flex-1 min-h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="temp"
                                stroke="#f97316"
                                fillOpacity={1}
                                fill="url(#colorTemp)"
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Power Grid */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 min-h-[180px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-200 uppercase tracking-tighter">
                        <Zap size={14} className="text-yellow-400" />
                        Power Load (kW)
                    </div>
                    <span className="text-[13px] font-mono text-yellow-400">{data[data.length - 1]?.power?.toFixed(1) || 0} kW</span>
                </div>
                <div className="flex-1 min-h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <Line
                                type="stepAfter"
                                dataKey="power"
                                stroke="#eab308"
                                dot={false}
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* NEW: Carbon Footprint */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 min-h-[180px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-200 uppercase tracking-tighter">
                        <Leaf size={14} className="text-emerald-400" />
                        CO2 Emission (kg/h)
                    </div>
                    <span className="text-[13px] font-mono text-emerald-400">
                        {((data[data.length - 1]?.power || 0) * 0.45).toFixed(2)}
                    </span>
                </div>
                <div className="flex-1 min-h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.map(d => ({ ...d, co2: d.power * 0.45 }))}>
                            <defs>
                                <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="co2"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorCO2)"
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* NEW: Sustainability Index */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-4 min-h-[180px]">
                <div className="flex items-center gap-2 text-[13px] font-bold text-slate-200 uppercase tracking-tighter">
                    <Wind size={14} className="text-cyan-400" />
                    Green Index
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-800"
                            />
                            <motion.circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={251}
                                initial={{ strokeDashoffset: 251 }}
                                animate={{ strokeDashoffset: 251 - (251 * (data[data.length - 1]?.power < 100 ? 92 : 65)) / 100 }}
                                className="text-emerald-500"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black text-white">
                                {data[data.length - 1]?.power < 100 ? 92 : 65}
                            </span>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Sustainability Score</p>
                </div>
            </div>
        </div>
    );
}
