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
    Activity
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
    const [showValidation, setShowValidation] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

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
        if (!name || !phone) {
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
            // 1. 나눔고딕 폰트 로드
            const fontResponse = await fetch('/fonts/NanumGothic.ttf');
            if (!fontResponse.ok) throw new Error("Font load failed");
            const fontBuffer = await fontResponse.arrayBuffer();

            // 2. Base64 변환
            let binary = '';
            const bytes = new Uint8Array(fontBuffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64Font = btoa(binary);

            // 3. jsPDF 설정 및 폰트 등록
            const doc = new jsPDF();
            doc.addFileToVFS('NanumGothic.ttf', base64Font);
            doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
            doc.setFont('NanumGothic');

            const pageWidth = doc.internal.pageSize.getWidth();
            const maturity = getMaturityLevel(score);

            // Header
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, pageWidth, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text("SNPE AI PROCESS DIAGNOSTICS", 20, 25);

            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(`Reference ID: DX-${Math.floor(Math.random() * 100000)}`, 20, 32);
            doc.text(`Company: ${company || "미지정"} | Client: ${name}`, 20, 37);

            // Body
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(16);
            doc.text("1. 진단 결과 요약", 20, 60);

            autoTable(doc, {
                startY: 70,
                head: [['진단 항목', '점수', '상태']],
                body: [
                    ['종합 지능화 점수', `${score} / 100`, 'Evaluated'],
                    ['성숙도 레벨', `Level ${maturity.level}`, maturity.name],
                    ['현재 핵심 상태', '-', maturity.desc],
                ],
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42], font: 'NanumGothic' },
                styles: { font: 'NanumGothic', fontStyle: 'normal' }
            });

            // Recommendations
            doc.setFontSize(16);
            // @ts-ignore
            const finalY = doc.lastAutoTable.finalY + 15;
            doc.text("2. 전략적 최적화 로드맵", 20, finalY);

            doc.setFontSize(11);
            const roadmaps = {
                1: "공정 데이터의 디지털화가 시급합니다. 수동 조작을 줄이기 위한 센서 부착과 기본 데이터 로깅 시스템 구축을 제안합니다.",
                2: "분절된 데이터를 중앙으로 통합하고, 실시간 모니터링을 통해 가시성을 확보하는 단계입니다.",
                3: "통합된 데이터를 바탕으로 AI 예지 보전 모델을 도입하여 가동률과 생산 효율을 극대화할 수 있습니다.",
                4: "전체 공정에 대한 AI 기반 자율 최적화 시스템을 구축하여 에너지 절감 및 품질 균일도를 혁신적으로 높입니다.",
                5: "이미 세계 선도 수준의 지능화 공정을 보유하고 있습니다. 차세대 코그니티브 팩토리 확산을 위한 고도화를 제안합니다."
            };
            // @ts-ignore
            const splitRoadmap = doc.splitTextToSize(roadmaps[maturity.level as keyof typeof roadmaps], pageWidth - 40);
            doc.text(splitRoadmap, 20, finalY + 12);

            // Footer
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184);
            doc.text("본 결과는 SNPE AI 엔진에 의해 생성된 가이드 리포트입니다.", pageWidth / 2, 280, { align: 'center' });

            doc.save(`SNPE_진단리포트_${name}.pdf`);
        } catch (error) {
            console.error("PDF 생성 에러:", error);
            alert("리포트 생성 중 오류가 발생했습니다. 한글 폰트 로드 상태를 확인해 주세요.");
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
                                className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-100 transition-all disabled:opacity-50"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
                                상세 진단 리포트 (PDF) 다운로드
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
