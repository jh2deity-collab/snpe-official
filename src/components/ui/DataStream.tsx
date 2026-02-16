"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function DataStream() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // We can also have a vertical line that follows the scroll
    const [pageHeight, setPageHeight] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        setPageHeight(document.body.scrollHeight);
        setWindowHeight(window.innerHeight);

        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[50] hidden lg:block">
            {/* Top Progress Bar */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 origin-left"
                style={{ scaleX }}
            />

            {/* Floating Particles in Background (Optional) */}
            <div className="absolute inset-0 overflow-hidden">
                {/* We could add particle effects here if needed, but keeping it clean for now */}
            </div>

            {/* Vertical Data Line on Left (Like a circuit trace) */}
            <div className="absolute left-[40px] top-0 bottom-0 w-[1px] bg-slate-800/30">
                <motion.div
                    className="w-[2px] h-[100px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent blur-[1px]"
                    style={{
                        y: useTransform(scrollYProgress, [0, 1], [0, windowHeight]),
                        opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1])
                    }}
                />
            </div>

            {/* Vertical Data Line on Right */}
            <div className="absolute right-[40px] top-0 bottom-0 w-[1px] bg-slate-800/30">
                <motion.div
                    className="w-[2px] h-[100px] bg-gradient-to-b from-transparent via-blue-500 to-transparent blur-[1px]"
                    style={{
                        y: useTransform(scrollYProgress, [0, 1], [0, windowHeight]),
                        opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1])
                    }}
                />
            </div>
        </div>
    );
}
