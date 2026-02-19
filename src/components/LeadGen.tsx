"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Loader2, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function LeadGen() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            company: formData.get("company"),
            name: formData.get("name"),
            phone: formData.get("phone"),
            content: formData.get("content"),
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsSuccess(true);
                (e.target as HTMLFormElement).reset();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "전송에 실패했습니다. 유선으로 문의해 주세요.");
            }
        } catch (error) {
            console.error(error);
            alert("네트워크 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="section-padding relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 bg-repeat bg-[length:50px_50px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-500/5 pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-[2px] bg-primary shadow-[0_0_15px_#3b82f6]" />
                                <span className="text-primary text-[13px] font-black uppercase tracking-[0.4em]">Get in Touch</span>
                            </div>
                            <h2 className="text-3xl md:text-[2.4vw] font-black text-white tracking-tighter leading-none">
                                START YOUR <br />
                                <span className="text-slate-800">JOURNEY</span>
                            </h2>
                            <p className="text-slate-200 text-xl font-bold leading-relaxed max-w-md border-l-2 border-slate-800 pl-6">
                                미래지향적 제조 생태계 구축의 시작, <br />
                                SNPE의 기술 상담이 답을 드립니다.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {/* Contact Info Cards */}
                            {[
                                { icon: <Phone className="text-blue-400" />, label: "전화 문의", val: "(042) 286-3639" },
                                { icon: <Mail className="text-blue-400" />, label: "이메일", val: "ok@snpe.kr" },
                                { icon: <MapPin className="text-blue-400" />, label: "본사 주소", val: "대전 유성구 테크노4로 17(관평동), 대덕비즈센터 A동 416호" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6 p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-sm transition-all hover:border-blue-500/30">
                                    <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center shadow-sm border border-white/5">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-white font-bold tracking-tight">{item.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right side: Form Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="bg-slate-900/40 backdrop-blur-2xl p-6 md:p-16 rounded-[2.5rem] border border-white/5 shadow-2xl">
                            {!isSuccess ? (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest ml-2">회사명</label>
                                            <input
                                                name="company"
                                                type="text"
                                                placeholder="(주) SNPE"
                                                className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-400 focus:bg-slate-900 focus:ring-4 focus:ring-blue-400/5 outline-none font-bold text-white transition-all placeholder:text-slate-600 shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest ml-2">성함 *</label>
                                            <input
                                                required
                                                name="name"
                                                type="text"
                                                placeholder="홍길동"
                                                className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-400 focus:bg-slate-900 focus:ring-4 focus:ring-blue-400/5 outline-none font-bold text-white transition-all placeholder:text-slate-600 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest ml-2">연락처 *</label>
                                        <input
                                            required
                                            name="phone"
                                            type="tel"
                                            placeholder="010-1234-5678"
                                            className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-400 focus:bg-slate-900 focus:ring-4 focus:ring-blue-400/5 outline-none font-bold text-white transition-all placeholder:text-slate-600 shadow-inner"
                                            value={phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                let formatted = val;
                                                if (val.length > 3 && val.length <= 7) {
                                                    formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
                                                } else if (val.length > 7) {
                                                    formatted = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 11)}`;
                                                }
                                                setPhone(formatted);
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-300 uppercase tracking-widest ml-2">문의 내용 *</label>
                                        <textarea
                                            required
                                            name="content"
                                            rows={4}
                                            placeholder="상담받으실 내용을 입력해 주세요."
                                            className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-400 focus:bg-slate-900 focus:ring-4 focus:ring-blue-400/5 outline-none font-bold text-white transition-all resize-none placeholder:text-slate-600 shadow-inner"
                                        />
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="bg-primary hover:bg-blue-700 text-white w-full py-6 rounded-2xl text-xl font-black flex items-center justify-center gap-4 shadow-xl shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <>
                                                <span>상담 신청하기</span>
                                                <ArrowUpRight />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20 space-y-8"
                                >
                                    <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-primary/30">
                                        <ShieldCheck size={48} />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-black text-white tracking-tight">상담 접수 완료</h3>
                                        <p className="text-slate-300 font-bold text-base md:text-lg leading-loose">
                                            정확하게 전달되었습니다. <br />
                                            담당 엔지니어가 <span className="text-blue-400">최대한 빠르게</span> 연락드리겠습니다.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] hover:underline"
                                    >
                                        추가 상담 신청하기
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
