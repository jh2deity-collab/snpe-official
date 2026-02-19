"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { AlertCircle, Lightbulb, TrendingUp, CheckCircle, Settings, Cpu, ChevronRight, Activity } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import ProjectModal from "@/components/ui/ProjectModal";

const PROJECTS = [
    {
        year: "2023",
        title: "글로벌 자동차 부품사 H사 공정 최적화",
        problem: "수동 검사 위주의 공정으로 인해 불량률이 4% 이상 발생하고 생산 데이터 집계가 불가능한 상황이었습니다.",
        solution: "AI 비전 검사 시스템과 실시간 MES(생산관리시스템)를 통합하여 전 공정 자동화 라인을 구축했습니다.",
        outcome: "불량률 0.5% 미만으로 감소, 생산성 35% 향상 및 실시간 공정 트래킹 실현",
        icon: <TrendingUp className="text-blue-500" />,
        techStack: ["Python", "TensorFlow", "OpenCV", "React"],
        stats: [
            { label: "Defect Rate", value: "0.5%" },
            { label: "Productivity", value: "+35%" },
            { label: "ROI", value: "240%" }
        ]
    },
    {
        year: "2022",
        title: "식음료 제조사 B사 탱크 제어 시스템 국산화",
        problem: "외산 설비의 노후화와 부품 수급 지연으로 인해 유지보수 비용이 급증하고 가동 중단 위험이 높았습니다.",
        solution: "고성능 국산 PLC 기반 전력 제어 및 모니터링 시스템으로 전면 교체하여 맞춤형 인터페이스를 제공했습니다.",
        outcome: "유지보수 비용 50% 절감, 설비 가동률 99.8% 달성 및 긴급 대응 체계 구축",
        icon: <Settings className="text-secondary" />,
        techStack: ["PLC", "SCADA", "Modbus", "C++"],
        stats: [
            { label: "Maint. Cost", value: "-50%" },
            { label: "Uptime", value: "99.8%" },
            { label: "Efficiency", value: "+28%" }
        ]
    },
    {
        year: "2021",
        title: "첨단 소재 기업 S사 스마트 팩토리 로드맵 수립",
        problem: "부서별 시스템 파편화로 인해 데이터 공유가 되지 않아 공정 설계 단계에서 잦은 오류가 발생했습니다.",
        solution: "클라우드 기반 협업 설계 플랫폼과 통합 데이터 레이크를 구축하여 디지털 트윈 기반 설계 환경을 마련했습니다.",
        outcome: "설계 오류 80% 감소, 신제품 런칭 주기 3개월 단축 및 전사적 데이터 통합 완료",
        icon: <Lightbulb className="text-primary" />,
        techStack: ["AWS", "Kubernetes", "Docker", "Next.js"],
        stats: [
            { label: "Design Error", value: "-80%" },
            { label: "Time-to-Market", value: "-30%" },
            { label: "Data Integrity", value: "100%" }
        ]
    },
];

export default function ProjectTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    return (
        <section id="expertise" className="section-padding bg-slate-950 relative overflow-hidden">
            <ProjectModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-32 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 border border-blue-500/30 backdrop-blur-sm"
                    >
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
                        <span className="text-blue-400 text-xs font-black tracking-[0.4em] uppercase">Success Record</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-[2.4vw] font-black text-white tracking-tighter leading-none">
                        PERFORMANCE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">MILESTONES</span>
                    </h2>
                </div>

                <div ref={containerRef} className="relative max-w-5xl mx-auto">
                    {/* Vertical Progress Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-800/50 hidden md:block">
                        <motion.div
                            style={{ scaleY: pathLength, originY: 0 }}
                            className="w-full h-full bg-cyan-500 shadow-[0_0_20px_#22d3ee]"
                        />
                    </div>

                    <div className="space-y-40 relative">
                        {PROJECTS.map((project, idx) => (
                            <ProjectItem
                                key={idx}
                                project={project}
                                index={idx}
                                onSelect={() => setSelectedProject(project)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProjectItem({ project, index, onSelect }: { project: any; index: number; onSelect: () => void }) {
    const isEven = index % 2 === 0;

    return (
        <div className={`flex flex-col md:flex-row items-center gap-16 ${isEven ? "" : "md:flex-row-reverse"}`}>
            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 w-full"
            >
                <TiltCard className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 md:p-12 rounded-[3rem] overflow-hidden group hover:border-blue-500/40 hover:bg-slate-900/60 transition-all duration-500 hover:shadow-[0_0_60px_rgba(37,99,235,0.15)] flex flex-col justify-between">
                    {/* Blueprint Decorations: Rulers */}
                    <div className="absolute top-0 left-0 w-full h-[20px] border-b border-white/5 flex justify-between px-4 items-end opacity-30">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className={`w-[1px] bg-white/50 ${i % 5 === 0 ? "h-[10px]" : "h-[5px]"}`} />
                        ))}
                    </div>
                    <div className="absolute bottom-0 right-0 w-[20px] h-full border-l border-white/5 flex flex-col justify-between py-4 items-start opacity-30">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className={`h-[1px] bg-white/50 ${i % 5 === 0 ? "w-[10px]" : "w-[5px]"}`} />
                        ))}
                    </div>

                    {/* Holographic Edge Effect */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Year Gradient Text */}
                    <div className="absolute top-0 right-0 px-10 py-6 font-black text-6xl text-white/5 group-hover:text-cyan-500/10 transition-colors select-none">
                        {project.year}
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-400 transition-all duration-500 shadow-lg">
                                {project.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white leading-tight group-hover:text-cyan-200 transition-colors">
                                {project.title}
                            </h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-5">
                                <AlertCircle className="text-red-500 shrink-0 mt-1" size={18} />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-red-500/70 uppercase tracking-[0.2em]">Pain Point</p>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed">{project.problem}</p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <CheckCircle className="text-blue-500 shrink-0 mt-1" size={18} />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-blue-500/70 uppercase tracking-[0.2em]">Solution</p>
                                    <p className="text-slate-200 text-sm font-bold leading-relaxed">{project.solution}</p>
                                </div>
                            </div>

                            {/* Tech Holograms */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {project.techStack.map((tech: string, i: number) => (
                                    <div key={i} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-300 font-mono flex items-center gap-1">
                                        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                                        {tech}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 flex items-center justify-between gap-6 group-hover:border-cyan-500/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-cyan-500/10 rounded-xl">
                                            <TrendingUp className="text-cyan-400" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Outcome</p>
                                            <p className="text-lg md:text-xl font-black text-white tracking-tight leading-none mt-1 group-hover:text-cyan-300 transition-colors">{project.outcome.split(',')[0]}...</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelect();
                                        }}
                                        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 text-slate-400 hover:text-white transition-all hover:scale-110"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TiltCard>
            </motion.div>

            {/* Timeline Dot (Desktop only) */}
            <div className="relative z-10 w-12 h-12 bg-slate-950 border border-slate-700 rounded-full hidden md:flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group">
                <div className="w-3 h-3 bg-slate-600 rounded-full group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_#22d3ee] transition-all duration-300 transform group-hover:scale-150" />
            </div>

            {/* Spacer for reverse layout */}
            <div className="flex-1 hidden md:block" />
        </div>
    );
}
