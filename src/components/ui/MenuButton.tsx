"use client";

import { motion } from "framer-motion";

interface MenuButtonProps {
    isOpen: boolean;
    onClick: () => void;
    className?: string;
}

export default function MenuButton({ isOpen, onClick, className = "" }: MenuButtonProps) {
    const variant = {
        top: {
            open: { rotate: 45, y: 6 },
            closed: { rotate: 0, y: 0 }
        },
        center: {
            open: { opacity: 0 },
            closed: { opacity: 1 }
        },
        bottom: {
            open: { rotate: -45, y: -6 },
            closed: { rotate: 0, y: 0 }
        }
    };

    return (
        <motion.button
            onClick={onClick}
            className={`w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md border border-slate-200/20 flex flex-col items-center justify-center gap-[5px] group hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                variants={variant.top}
                animate={isOpen ? "open" : "closed"}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-5 h-0.5 bg-slate-700 group-hover:bg-blue-400 transition-colors origin-center rounded-full"
            />
            <motion.div
                variants={variant.center}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.2 }}
                className="w-5 h-0.5 bg-slate-700 group-hover:bg-blue-400 transition-colors origin-center rounded-full"
            />
            <motion.div
                variants={variant.bottom}
                animate={isOpen ? "open" : "closed"}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-5 h-0.5 bg-slate-700 group-hover:bg-blue-400 transition-colors origin-center rounded-full"
            />
        </motion.button>
    );
}
