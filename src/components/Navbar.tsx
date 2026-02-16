"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MenuButton from "./ui/MenuButton";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 transition-all duration-500 shadow-sm">
            <div className="container-custom h-20 md:h-24 flex items-center justify-between">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    {/* Logo Image */}
                    <div className="relative h-12 md:h-20 w-auto">
                        <img
                            src="/images/logo.png"
                            alt="SNPE Logo"
                            className="h-full w-auto object-contain"
                        />
                    </div>
                </motion.div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-11 font-bold text-[14px] tracking-[0.1em] text-slate-600 uppercase">
                    {[
                        { label: "Services", id: "services" },
                        { label: "Simulator", id: "simulation" },
                        { label: "Portfolio", id: "expertise" },
                        { label: "Insights", id: "insights" }
                    ].map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="hover:text-cyan-400 transition-all relative group font-black"
                        >
                            {item.label}
                            <motion.span
                                className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"
                            />
                        </a>
                    ))}
                </div>

                {/* CTA Button and Mobile Menu Trigger */}
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                        className="hidden md:flex items-center justify-center px-10 py-3.5 rounded-xl font-black text-[15px] uppercase tracking-widest text-white transition-all relative overflow-hidden group shadow-xl shadow-blue-500/20"
                        style={{
                            background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                        }}
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <span className="relative z-10 flex items-center gap-2">
                            상담 신청하기
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-1000" />
                    </motion.button>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <MenuButton
                            isOpen={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                    height: isMenuOpen ? "auto" : 0,
                    opacity: isMenuOpen ? 1 : 0
                }}
                className="lg:hidden overflow-hidden bg-slate-900/95 backdrop-blur-2xl border-t border-white/5 absolute top-full left-0 right-0 shadow-2xl"
            >
                <div className="container-custom py-8 flex flex-col gap-6">
                    {[
                        { label: "주요 서비스", id: "services" },
                        { label: "시뮬레이션", id: "simulation" },
                        { label: "수행 실적", id: "expertise" },
                        { label: "도입 효과", id: "insights" }
                    ].map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-black text-slate-800 hover:text-primary transition-colors py-2 border-b border-slate-100"
                        >
                            {item.label}
                        </a>
                    ))}
                    <button
                        onClick={() => {
                            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                            setIsMenuOpen(false);
                        }}
                        className="bg-primary text-white px-6 py-4 rounded-xl font-black text-lg uppercase tracking-widest shadow-lg mt-4"
                    >
                        상담 신청하기
                    </button>
                </div>
            </motion.div>
        </nav>
    );
}
