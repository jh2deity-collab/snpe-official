"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ClipboardCheck,
    BarChart3,
    Zap,
    ArrowRight,
    Download,
    Loader2,
    FileText,
    AlertCircle,
    X,
    Target,
    Cpu,
    Database,
    ShieldCheck,
    Activity,
    Settings,
    Layers
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Diagnostic Question Type
interface Question {
    id: string;
    text: string;
    points: number;
    category: "data" | "automation" | "analysis" | "maintenance";
}

const QUESTIONS: Question[] = [
    { id: "q1", text: "실시간 데이터 수집 및 로그 관리가 자동화되어 있습니까?", points: 15, category: "data" },
    { id: "q2", text: "공정 내 주요 설비들이 상호 통신(M2M)이 가능합니까?", points: 15, category: "automation" },
    { id: "q3", text: "과거 데이터를 바탕으로 설비 고장을 미리 예측하고 있습니까?", points: 20, category: "maintenance" },
    { id: "q4", text: "생산 계획 수립 시 AI 최적화 알고리즘을 사용합니까?", points: 20, category: "analysis" },
    { id: "q5", text: "불량 검수 과정이 비전 AI나 센서를 통해 자동화되어 있습니까?", points: 15, category: "automation" },
    { id: "q6", text: "현장의 모든 데이터를 중앙 센터에서 실시간 대시보드로 관제합니까?", points: 15, category: "data" },
];

export default function ProcessDiagnostics() {
    const [step, setStep] = useState<"intro" | "survey" | "analyzing" | "result">("intro");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    // User Info
    const [company, setCompany] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [industry, setIndustry] = useState("");
    const [showValidation, setShowValidation] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const INDUSTRIES = [
        { id: "semi", name: "반도체/디스플레이", icon: <Cpu />, bg: "from-blue-500/10 to-transparent" },
        { id: "auto", name: "자동차/모빌리티", icon: <Settings />, bg: "from-cyan-500/10 to-transparent" },
        { id: "bio", name: "바이오/식음료", icon: <Activity />, bg: "from-emerald-500/10 to-transparent" },
        { id: "gen", name: "일반 제조/기타", icon: <Layers />, bg: "from-indigo-500/10 to-transparent" },
    ];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        let formatted = value;
        if (value.length > 3 && value.length <= 7) {
            formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else if (value.length > 7) {
            formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
        }
        setPhone(formatted);
    };

    const toggleQuestion = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const runAnalysis = () => {
        if (!name || !phone || !industry) {
            setShowValidation(true);
            setShowAlert(true);
            return;
        }

        setStep("analyzing");
        // Calculate Score
        const total = QUESTIONS.filter(q => selectedIds.includes(q.id)).reduce((acc, q) => acc + q.points, 0);
        setScore(total);

        setTimeout(() => {
            setStep("result");
        }, 3000);
    };

    const getMaturityLevel = (s: number) => {
        if (s >= 85) return { level: 5, name: "Cognitive Factory", color: "text-purple-400", desc: "자율 지능형 공정" };
        if (s >= 65) return { level: 4, name: "Smart Optimization", color: "text-blue-400", desc: "지능형 최적화 단계" };
        if (s >= 45) return { level: 3, name: "Connected Data", color: "text-cyan-400", desc: "데이터 통합 모니터링" };
        if (s >= 25) return { level: 2, name: "Digital Ready", color: "text-emerald-400", desc: "디지털 전환 시작 단계" };
        return { level: 1, name: "Manual Operation", color: "text-slate-400", desc: "수동 중심 공정" };
    };

    const handleDownloadReport = async () => {
        setIsGenerating(true);

        try {
            const fontResponse = await fetch('/fonts/NanumGothic.ttf');
            if (!fontResponse.ok) throw new Error("Font load failed");
            const fontBuffer = await fontResponse.arrayBuffer();

            let binary = '';
            const bytes = new Uint8Array(fontBuffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64Font = btoa(binary);

            const doc = new jsPDF();
            doc.addFileToVFS('NanumGothic.ttf', base64Font);
            doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
            doc.setFont('NanumGothic');

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const maturity = getMaturityLevel(score);

            // PAGE 1: TITLE PAGE
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(40);
            doc.text("SNPE", pageWidth / 2, 100, { align: 'center' });
            doc.setFontSize(24);
            doc.text("CUSTOM AI WHITEPAPER", pageWidth / 2, 120, { align: 'center' });

            doc.setDrawColor(59, 130, 246);
            doc.setLineWidth(1);
            doc.line(pageWidth / 2 - 40, 130, pageWidth / 2 + 40, 130);

            doc.setFontSize(14);
            doc.text(`Target Industry: ${industry}`, pageWidth / 2, 160, { align: 'center' });
            doc.text(`Client: ${company || name}`, pageWidth / 2, 170, { align: 'center' });

            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(`Ref ID: WH-SNPE-${Math.floor(Date.now() / 1000)}`, pageWidth / 2, 260, { align: 'center' });
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 265, { align: 'center' });

            // PAGE 2: EXECUTIVE SUMMARY
            doc.addPage();
            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            doc.setTextColor(15, 23, 42);
            doc.setFontSize(20);
            doc.text("1. EXECUTIVE SUMMARY", 20, 40);

            doc.setFontSize(12);
            doc.setTextColor(71, 85, 105);
            const summaryText = `본 백서는 ${industry} 부문의 공정 고도화를 위해 작성되었습니다. 귀사의 현재 지능화 성숙도 점수는 ${score}점(Level ${maturity.level})으로 측정되었으며, 이는 '${maturity.name}' 단계에 해당합니다.`;
            doc.text(doc.splitTextToSize(summaryText, pageWidth - 40), 20, 55);

            autoTable(doc, {
                startY: 75,
                head: [['영역', '평가 기준', '상태']],
                body: [
                    ['Data Integration', '실시간 수집 및 로그 체계', score > 30 ? '우수' : '보완 필요'],
                    ['Automation', 'M2M 및 무인화 수준', score > 50 ? '우수' : '보완 필요'],
                    ['AI Intelligence', '예지 보전 및 자율 최적화', score > 80 ? '최상위' : '도입 준비'],
                ],
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42], font: 'NanumGothic' },
                styles: { font: 'NanumGothic' }
            });

            // PAGE 3: RECOMMENDED TECH STACK
            doc.addPage();
            doc.setFontSize(20);
            doc.setTextColor(15, 23, 42);
            doc.text("2. RECOMMENDED TECH STACK", 20, 40);

            const getStack = () => {
                if (industry === "반도체/디스플레이") return [
                    ["Control Layer", "High-Speed PLC (0.1ms)", "초정밀 극소 시간 제어"],
                    ["Data Layer", "Edge-Computing MES", "현장 밀착형 실시간 로그 통합"],
                    ["AI Layer", "DL-Defect Vision AI", "나노급 불량 검출 및 분류"]
                ];
                return [
                    ["Control Layer", "IPC & Real-time OS", "범용 데이터 처리 및 제어 안정성"],
                    ["Data Layer", "Cloud-Based SCADA", "광역 자원 통합 모니터링"],
                    ["AI Layer", "Predictive Maintenance", "고장 전조 증상 정밀 분석"]
                ];
            };

            autoTable(doc, {
                startY: 55,
                head: [['Layer', 'Solution Name', 'Core Value']],
                body: getStack(),
                theme: 'striped',
                headStyles: { fillColor: [59, 130, 246], font: 'NanumGothic' },
                styles: { font: 'NanumGothic' }
            });

            // PAGE 4: IMPACT & ROADMAP
            doc.addPage();
            doc.setFontSize(20);
            doc.text("3. IMPACT & ROADMAP", 20, 40);

            doc.setFontSize(14);
            doc.text("■ 기대 효과 (ROI / ESG)", 20, 55);
            doc.setFontSize(11);
            doc.setTextColor(51, 65, 85);
            doc.text(`- 운영 효율(OEE) 향상: 약 ${score < 50 ? "15-20%" : "5-10% 추가"} 기대`, 25, 65);
            doc.text(`- 탄소 세수 절감: 연간 약 3.2톤 배출량 저감 효과 예측`, 25, 72);

            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text("■ 전략적 로드맵 (Phase 1-3)", 20, 95);
            doc.setFontSize(11);
            doc.text("1. Phase 1 (Short-term): 센서 보강 및 데이터 인프라 실시간 통합", 25, 105);
            doc.text("2. Phase 2 (Mid-term): AI 기반 예지 보전 모델 및 불량 관리 자동화", 25, 112);
            doc.text("3. Phase 3 (Long-term): 자율 최적화 공정 및 글로벌 관제 허브 구축", 25, 119);

            // Footer for all pages
            const totalPages = doc.internal.pages.length - 1;
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(9);
                doc.setTextColor(148, 163, 184);
                doc.text(`SNPE Custom Technical Whitepaper | Page ${i} of ${totalPages}`, pageWidth / 2, 285, { align: 'center' });
            }

            doc.save(`SNPE_Technical_Whitepaper_${name}.pdf`);
        } catch (error) {
            console.error("PDF 생성 에러:", error);
            alert("백서 생성 중 오류가 발생했습니다.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-white/5 relative overflow-hidden shadow-2xl min-h-[600px] flex flex-col justify-center">

            <AnimatePresence mode="wait">
                {step === "intro" && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mx-auto border border-blue-500/30">
                            <ClipboardCheck size={40} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">AI 공정 지능도 진단</h3>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                귀사의 생산 라인은 얼마나 스마트합니까? <br />
                                6가지 핵심 진단 항목을 통해 지능화 수준을 분석하고 최적의 로드맵을 받아보세요.
                            </p>
                        </div>
                        <button
                            onClick={() => setStep("survey")}
                            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-3 mx-auto transition-all group shadow-xl shadow-blue-500/20"
                        >
                            진단 시작하기
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}

                {step === "survey" && (
                    <motion.div
                        key="survey"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-10"
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            {QUESTIONS.map((q) => (
                                <button
                                    key={q.id}
                                    onClick={() => toggleQuestion(q.id)}
                                    className={`p-6 rounded-2xl border transition-all text-left flex gap-4 items-start relative overflow-hidden group ${selectedIds.includes(q.id)
                                        ? "bg-blue-600/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                                        : "bg-slate-950/50 border-slate-800/50 hover:border-slate-700"
                                        }`}
                                >
                                    <div className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedIds.includes(q.id) ? "border-blue-500 bg-blue-500 text-white" : "border-slate-700"
                                        }`}>
                                        {selectedIds.includes(q.id) && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>}
                                    </div>
                                    <span className={`text-[15px] font-bold leading-relaxed ${selectedIds.includes(q.id) ? "text-white" : "text-slate-400"}`}>
                                        {q.text}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5 space-y-6">
                            <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">결과 수령 정보</h4>
                            <div className="grid md:grid-cols-3 gap-6">
                                <input
                                    type="text"
                                    placeholder="성함 *"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`bg-slate-900 border ${showValidation && !name ? "border-red-400" : "border-slate-800"} rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none`}
                                />
                                <input
                                    type="tel"
                                    placeholder="연락처 *"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    maxLength={13}
                                    className={`bg-slate-900 border ${showValidation && !phone ? "border-red-400" : "border-slate-800"} rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none`}
                                />
                                <input
                                    type="text"
                                    placeholder="회사명"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">산업 분야 선택 (필수)</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {INDUSTRIES.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setIndustry(item.name)}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${industry === item.name
                                                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                                                    : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                                                }`}
                                        >
                                            <div className="scale-75">{item.icon}</div>
                                            <span className="text-[10px] font-bold">{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={runAnalysis}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
                            >
                                <Zap size={20} className="animate-pulse" />
                                AI 분석 실행
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === "analyzing" && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="relative w-32 h-32 mx-auto">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-blue-400">
                                <Cpu size={48} className="animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">기술 분석 중...</h3>
                            <p className="text-slate-400 font-mono text-sm tracking-widest">
                                [ PROCESSING NEURAL KERNEL FOR {company.toUpperCase() || "CLIENT"} ]
                            </p>
                        </div>
                    </motion.div>
                )}

                {step === "result" && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid md:grid-cols-2 gap-12"
                    >
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Diagnostic Summary</span>
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase">진단 결과 보고</h3>
                            </div>

                            <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                                <div className="text-center space-y-4">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Maturity Score</p>
                                    <div className="text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                        {score}<span className="text-2xl text-slate-500">/100</span>
                                    </div>
                                    <div className={`text-xl font-black ${getMaturityLevel(score).color} uppercase`}>
                                        {getMaturityLevel(score).name}
                                    </div>
                                    <p className="text-slate-300 font-medium">{getMaturityLevel(score).desc}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleDownloadReport}
                                disabled={isGenerating}
                                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
                                지능형 맞춤 기술 제안 백서 (PDF) 발행
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
                                <div className="flex items-center gap-3 text-blue-400">
                                    <Target size={20} />
                                    <h4 className="font-black text-sm uppercase tracking-widest">추천 솔루션 로드맵</h4>
                                </div>
                                <p className="text-slate-300 text-[15px] leading-relaxed">
                                    {score < 50
                                        ? "디지털 전환의 기초가 필요한 단계입니다. SNPE의 데이터 로깅 하드웨어와 실시간 대시보드 구축을 통해 공정 가시성을 확보하는 것이 첫 걸음입니다."
                                        : "이미 높은 지능화 수준을 갖추고 있습니다. 이제 AI 예지 보전과 공정 자율 최적화를 통해 운영 비용을 획기적으로 절감할 때입니다."
                                    }
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-600/10 rounded-xl border border-blue-500/20 flex flex-col items-center gap-2">
                                    <Database size={24} className="text-blue-400" />
                                    <span className="text-[11px] font-bold text-slate-300">데이터 통합</span>
                                </div>
                                <div className="p-4 bg-cyan-600/10 rounded-xl border border-cyan-500/20 flex flex-col items-center gap-2">
                                    <Activity size={24} className="text-cyan-400" />
                                    <span className="text-[11px] font-bold text-slate-300">예지 보전</span>
                                </div>
                                <div className="p-4 bg-purple-600/10 rounded-xl border border-purple-500/20 flex flex-col items-center gap-2">
                                    <Zap size={24} className="text-purple-400" />
                                    <span className="text-[11px] font-bold text-slate-300">공정 최적화</span>
                                </div>
                                <div className="p-4 bg-emerald-600/10 rounded-xl border border-emerald-500/20 flex flex-col items-center gap-2">
                                    <ShieldCheck size={24} className="text-emerald-400" />
                                    <span className="text-[11px] font-bold text-slate-300">보안 관제</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep("survey")}
                                className="w-full py-4 border border-slate-800 text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                            >
                                다시 진단하기
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Validation Alert (Reused logic) */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm"
                    >
                        <div className="bg-slate-900 border border-red-500/30 p-5 rounded-2xl shadow-2xl flex items-center gap-4">
                            <AlertCircle className="text-red-400 shrink-0" size={24} />
                            <div className="flex-1">
                                <p className="text-white text-sm font-bold">정보 입력 필요</p>
                                <p className="text-slate-400 text-xs">성함과 연락처를 입력해 주세요.</p>
                            </div>
                            <button onClick={() => setShowAlert(false)} className="text-slate-500"><X size={18} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
