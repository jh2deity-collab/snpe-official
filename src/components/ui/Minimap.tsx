"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Navigation } from "lucide-react";
import { useEffect, useState } from "react";

const SECTIONS = [
    { id: "hero", label: "01" },
    { id: "services", label: "02" },
    { id: "simulation", label: "03" },
    { id: "expertise", label: "04" },
    { id: "core-values", label: "05" },
    { id: "contact", label: "06" },
];

export default function Minimap() {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[50] hidden lg:flex flex-col gap-2 items-center">
            {/* Holographic Track */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-4">
                <Navigation size={18} className="text-blue-400" />
                <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Network Map</h4>
            </div>
            <div className="absolute top-0 bottom-0 w-[1px] bg-slate-800/50 -z-10" />

            {/* Progress Bar */}
            <motion.div
                className="absolute top-0 w-[2px] bg-cyan-500 shadow-[0_0_10px_#22d3ee] origin-top"
                style={{ height: "100%", scaleY }}
            />

            {SECTIONS.map((section, idx) => (
                <MinimapNode key={section.id} id={section.id} label={section.label} />
            ))}
        </div>
    );
}

function MinimapNode({ id, label }: { id: string; label: string }) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const element = document.getElementById(id);
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const center = window.innerHeight / 2;

            // Check if element is roughly in center of screen
            if (rect.top <= center && rect.bottom >= center) {
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [id]);

    return (
        <button
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className="group relative flex items-center justify-center w-4 h-4 my-2"
        >
            <motion.div
                animate={{
                    scale: isActive ? 1.5 : 1,
                    backgroundColor: isActive ? "#06b6d4" : "#1e293b"
                }}
                className={`w-2 h-2 rounded-full border transition-colors ${isActive ? "border-cyan-400 shadow-[0_0_10px_#22d3ee]" : "border-slate-600 group-hover:border-slate-400"}`}
            />

            {/* Tooltip Label */}
            <span className={`absolute right-8 font-mono text-[11px] tracking-widest transition-all duration-300 ${isActive ? "text-cyan-400 opacity-100 translate-x-0" : "text-slate-500 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}>
                {label}
            </span>
        </button>
    );
}
