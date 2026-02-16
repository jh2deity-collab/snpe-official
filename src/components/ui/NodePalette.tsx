"use client";

import { motion } from "framer-motion";
import { Cpu, Settings, Zap, CheckCircle2, Box, Truck, Database, Factory, Trash2, Plus, Layers } from "lucide-react";

export interface PaletteNode {
    type: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

export const PALETTE_ITEMS: PaletteNode[] = [
    { type: "input", label: "Raw Material", icon: <Box size={18} />, color: "text-amber-400" },
    { type: "assembly", label: "Assembly Robot", icon: <Cpu size={18} />, color: "text-blue-400" },
    { type: "quality", label: "Quality Scanner", icon: <Zap size={18} />, color: "text-purple-400" },
    { type: "packing", label: "Automated Packing", icon: <Settings size={18} />, color: "text-emerald-400" },
    { type: "agv", label: "Logistics AGV", icon: <Truck size={18} />, color: "text-rose-400" },
    { type: "server", label: "Edge Computing", icon: <Database size={18} />, color: "text-cyan-400" },
];

interface NodePaletteProps {
    onAddNode: (item: PaletteNode) => void;
    currentNodes: any[];
    onRemoveNode: (index: number) => void;
}

export default function NodePalette({ onAddNode, currentNodes, onRemoveNode }: NodePaletteProps) {
    return (
        <div className="flex flex-col gap-6 h-full p-4 overflow-y-auto scrollbar-none">
            {/* Palette Section */}
            <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Building Blocks</h3>
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                    <Layers size={18} className="text-blue-400" />
                    <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Node Library</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {PALETTE_ITEMS.map((item) => (
                        <button
                            key={item.type}
                            onClick={() => onAddNode(item)}
                            className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-slate-600 hover:bg-slate-800 transition-all group active:scale-95"
                        >
                            <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <span className="text-[11px] font-bold text-slate-200 text-center leading-tight uppercase">
                                {item.label}
                            </span>
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus size={10} className="text-slate-300" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Chain Section */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Active Sequence</h3>
                    <span className="text-[11px] font-mono text-slate-600">{currentNodes.length} / 8</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                    {currentNodes.map((node, idx) => (
                        <motion.div
                            key={`${node.id}-${idx}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-900/50 border border-slate-800 p-2 rounded-lg flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-slate-700 w-3">{idx + 1}</span>
                                <div className="text-cyan-500">
                                    {node.icon}
                                </div>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                    {node.label}
                                </span>
                            </div>
                            <button
                                onClick={() => onRemoveNode(idx)}
                                className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={12} />
                            </button>
                        </motion.div>
                    ))}
                    {currentNodes.length === 0 && (
                        <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-600 gap-2">
                            <Factory size={24} className="opacity-20" />
                            <p className="text-[10px] italic">Select blocks to build your flow</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Hint */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                <p className="text-[9px] text-blue-300 leading-relaxed font-medium">
                    <span className="font-black text-blue-400 mr-1 opacity-100 underline decoration-blue-500/30 font-mono">TIP:</span>
                    최대 8개의 블록까지 조립할 수 있습니다. 조립 후 상단의 'CUSTOM OPTIMIZE' 버튼을 눌러 AI 최적화 결과를 확인하세요.
                </p>
            </div>
        </div>
    );
}
