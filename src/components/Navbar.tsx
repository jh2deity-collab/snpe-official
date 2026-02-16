"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MenuButton from "./ui/MenuButton";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-500">
            <div className="container-custom h-20 md:h-28 flex items-center justify-between">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    {/* Logo Image */}
                    <div className="relative h-16 md:h-28 w-auto">
                        <img
                            src="/images/logo.png"
                            alt="SNPE Logo"
                            className="h-full w-auto object-contain mix-blend-multiply"
                        />
                    </div>
                </motion.div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-11 font-bold text-[20px] tracking-tight text-slate-600">
                    {[
                        { label: "주요 서비스", id: "services" },
                        { label: "시뮬레이션", id: "simulation" },
                        { label: "수행 실적", id: "expertise" },
                        { label: "도입 효과", id: "insights" }
                    ].map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="hover:text-primary transition-colors relative group font-black"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* CTA Button and Mobile Menu Trigger */}
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                        className="hidden md:block bg-primary text-white px-9 py-3.5 rounded-xl font-black text-[17px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border border-primary/20"
                    >
                        상담 신청
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
                className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50 absolute top-full left-0 right-0 shadow-2xl"
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
