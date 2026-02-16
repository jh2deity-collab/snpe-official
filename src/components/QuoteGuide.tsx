"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Factory,
    Car,
    Beer,
    Cpu,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    FileText,
    Zap,
    ShieldCheck,
    Send,
    Loader2
} from "lucide-react";

type Step = "industry" | "solution" | "scale" | "contact" | "success";

export default function QuoteGuide() {
    const [step, setStep] = useState<Step>("industry");
    const [formData, setFormData] = useState({
        industry: "",
        solution: "",
        scale: "",
        company: "",
        name: "",
        phone: "",
        content: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const INDUSTRIES = [
        { id: "semi", name: "반도체/디스플레이", icon: <Cpu /> },
        { id: "auto", name: "자동차/모빌리티", icon: <Car /> },
        { id: "food", name: "식음료/바이오", icon: <Beer /> },
        { id: "general", name: "일반 제조/기타", icon: <Factory /> },
    ];

    const SOLUTIONS = [
        { id: "fa", name: "FA 공정 자동화", desc: "생산 라인 무인화 및 제어 시스템" },
        { id: "pe", name: "프로세스 엔지니어링", desc: "열교환, 유체 제어 시스템 설계" },
        { id: "sw", name: "산업용 S/W 개발", desc: "MES, 원격 모니터링 플랫폼" },
        { id: "cctv", name: "지능형 영상 보안", desc: "AI 기반 산업 현장 관제" },
        { id: "maintenance", name: "시스템 유지보수", desc: "24/365 실시간 모니터링/장애 대응" },
    ];

    const submitForm = async () => {
        // Validation: Check for required fields
        if (!formData.name.trim() || !formData.phone.trim()) {
            alert("필수 항목(성함, 연락처)을 모두 입력해 주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    content: `[지능형 견적 신청]\n산업군: ${formData.industry}\n솔루션: ${formData.solution}\n규모: ${formData.scale}\n\n추가내용: ${formData.content}`
                }),
            });

            if (response.ok) {
                setStep("success");
            } else {
                alert("전송 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("네트워크 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="quote" className="section-padding relative bg-background overflow-hidden">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/contact-bg.png"
                    alt="Contact Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-white/40 backdrop-blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center space-y-8 mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-6 py-2 bg-white border border-slate-200/50 rounded-full shadow-sm"
                        >
                            <Zap size={14} className="text-primary animate-pulse" />
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Smart Factory Consulting</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-[3vw] font-black text-slate-900 tracking-tighter leading-none">
                            GET YOUR <br />
                            <span className="text-slate-200">GUIDELINE</span>
                        </h2>
                    </div>

                    {/* Stepper Content */}
                    <div className="bg-white p-10 md:p-20 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-200/30 border border-slate-200/50">
                        <AnimatePresence mode="wait">
                            {step === "industry" && (
                                <motion.div
                                    key="industry"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-16"
                                >
                                    <div className="text-center space-y-3">
                                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Phase 01</p>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">산업군을 선택해 주세요</h3>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                        {INDUSTRIES.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setFormData({ ...formData, industry: item.name });
                                                    setStep("solution");
                                                }}
                                                className="group flex flex-col items-center gap-8 p-10 bg-white border-2 border-slate-100 hover:border-primary hover:bg-primary/5 transition-all duration-500 rounded-[2rem] shadow-sm"
                                            >
                                                <div className="w-20 h-20 bg-slate-50 group-hover:bg-primary text-slate-400 group-hover:text-white rounded-3xl flex items-center justify-center transition-all duration-500 shadow-sm border border-slate-200/50 group-hover:border-primary">
                                                    {item.icon}
                                                </div>
                                                <span className="font-black text-[15px] text-slate-900 group-hover:text-primary transition-colors tracking-tighter uppercase">{item.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === "solution" && (
                                <motion.div
                                    key="solution"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-16"
                                >
                                    <div className="text-center space-y-3">
                                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Phase 02</p>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">필요한 솔루션은 무엇인가요?</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {SOLUTIONS.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setFormData({ ...formData, solution: item.name });
                                                    setStep("scale");
                                                }}
                                                className="group flex items-center gap-10 p-10 bg-white border-2 border-slate-100 hover:border-primary hover:bg-primary/5 transition-all duration-500 text-left rounded-[2rem] shadow-sm"
                                            >
                                                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
                                                    {item.id.toUpperCase()}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-slate-900 text-2xl tracking-tight underline decoration-primary/30 decoration-2 underline-offset-4 decoration-transparent group-hover:decoration-primary transition-all">{item.name}</p>
                                                    <p className="text-slate-600 text-sm font-bold mt-2 leading-relaxed">{item.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setStep("industry")} className="flex items-center gap-3 text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] hover:text-primary transition-colors mx-auto group">
                                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        <span>Back to Step 01</span>
                                    </button>
                                </motion.div>
                            )}

                            {step === "scale" && (
                                <motion.div
                                    key="scale"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-16"
                                >
                                    <div className="text-center space-y-3">
                                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Phase 03</p>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">프로젝트 규모를 선택해 주세요</h3>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {[
                                            { label: "단일 공정 도입", icon: <Zap /> },
                                            { label: "전체 라인 구축", icon: <Factory /> },
                                            { label: "시스템 통합/리뉴얼", icon: <ShieldCheck /> },
                                        ].map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() => {
                                                    setFormData({ ...formData, scale: item.label });
                                                    setStep("contact");
                                                }}
                                                className="flex flex-col items-center gap-10 p-12 bg-white border-2 border-slate-100 hover:border-primary transition-all duration-500 group rounded-[2rem] shadow-sm"
                                            >
                                                <div className="text-slate-400 group-hover:text-primary transition-all duration-500 group-hover:scale-125">
                                                    {item.icon}
                                                </div>
                                                <span className="font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-widest text-[11px]">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setStep("solution")} className="flex items-center gap-3 text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] hover:text-primary transition-colors mx-auto group">
                                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        <span>Back to Step 02</span>
                                    </button>
                                </motion.div>
                            )}

                            {step === "contact" && (
                                <motion.div
                                    key="contact"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-16"
                                >
                                    <div className="text-center space-y-8">
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">최종 리포트 신청</h3>
                                        <div className="inline-block p-10 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-left max-w-xl shadow-sm">
                                            <ul className="space-y-5">
                                                <li className="flex items-center gap-4 text-slate-800 font-black text-sm">
                                                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center"><CheckCircle2 size={14} /></div>
                                                    {formData.industry} 특화 솔루션 매칭 완료
                                                </li>
                                                <li className="flex items-center gap-4 text-slate-800 font-black text-sm">
                                                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center"><CheckCircle2 size={14} /></div>
                                                    {formData.solution} 정밀 최적화 경로 설계
                                                </li>
                                                <li className="flex items-center gap-4 text-slate-800 font-black text-sm">
                                                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center"><CheckCircle2 size={14} /></div>
                                                    {formData.scale} 대응 엔지니어링 패키지
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <input
                                            type="text"
                                            placeholder="회사명"
                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none font-bold text-slate-900 transition-all shadow-sm placeholder:text-slate-400"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="성함 *"
                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none font-bold text-slate-900 transition-all shadow-sm placeholder:text-slate-400"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        <input
                                            type="tel"
                                            placeholder="연락처 * (가이드 수령용)"
                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none font-bold text-slate-900 transition-all col-span-2 shadow-sm placeholder:text-slate-400"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                let formatted = val;
                                                if (val.length > 3 && val.length <= 7) {
                                                    formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
                                                } else if (val.length > 7) {
                                                    formatted = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 11)}`;
                                                }
                                                setFormData({ ...formData, phone: formatted });
                                            }}
                                        />
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        className="bg-primary hover:bg-blue-700 text-white w-full py-6 rounded-2xl text-xl font-black flex items-center justify-center gap-4 shadow-xl shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                                        <span>가이드 리포트 신청하기</span>
                                    </button>

                                    <button onClick={() => setStep("scale")} className="flex items-center gap-3 text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] hover:text-primary transition-colors mx-auto group">
                                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                        <span>Back to Step 03</span>
                                    </button>
                                </motion.div>
                            )}

                            {step === "success" && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-12 py-10"
                                >
                                    <div className="w-32 h-32 bg-primary rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-primary/30">
                                        <FileText size={48} />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-5xl font-black text-slate-900 tracking-tight">신청 완료</h3>
                                        <p className="text-slate-500 font-bold text-xl leading-relaxed max-w-lg mx-auto">
                                            분석된 정보를 바탕으로 SNPE 기술팀이 <br />
                                            <span className="text-primary">맞춤형 기술 가이드 팩</span>을 준비 중입니다.
                                        </p>
                                    </div>
                                    <div className="pt-10">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="px-10 py-5 bg-slate-50 rounded-2xl border border-slate-100 inline-block text-[13px] font-black tracking-widest text-primary uppercase italic"
                                        >
                                            "Engineering Trust, Delivering Future"
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
