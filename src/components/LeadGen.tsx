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
                alert("전송에 실패했습니다. 유선으로 문의해 주세요.");
            }
        } catch (error) {
            console.error(error);
            alert("네트워크 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="section-padding relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />

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
                                <div className="w-12 h-[2px] bg-primary" />
                                <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">Get in Touch</span>
                            </div>
                            <h2 className="text-4xl md:text-[3vw] font-black text-slate-900 tracking-tighter leading-none">
                                START YOUR <br />
                                <span className="text-slate-200">JOURNEY</span>
                            </h2>
                            <p className="text-slate-600 text-xl font-bold leading-relaxed max-w-md">
                                미래지향적 제조 생태계 구축의 시작, <br />
                                SNPE의 기술 상담이 답을 드립니다.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { icon: <Phone className="text-primary" />, label: "전화 문의", val: "(042) 286-3639" },
                                { icon: <Mail className="text-primary" />, label: "이메일", val: "support@snpe.co.kr" },
                                { icon: <MapPin className="text-primary" />, label: "본사 주소", val: "대전 유성구 테크노4로 17(관평동), 대덕비즈센터 A동 416호" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-slate-200/50 shadow-sm transition-all hover:border-primary/30">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-slate-900 font-bold tracking-tight">{item.val}</p>
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
                        <div className="bg-white p-12 md:p-16 rounded-[2.5rem] border border-slate-200/50 shadow-2xl shadow-slate-200/30">
                            {!isSuccess ? (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">회사명</label>
                                            <input
                                                name="company"
                                                type="text"
                                                placeholder="(주) SNPE"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none font-bold text-slate-900 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">성함 *</label>
                                            <input
                                                required
                                                name="name"
                                                type="text"
                                                placeholder="홍길동"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none font-bold text-slate-900 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">연락처 *</label>
                                        <input
                                            required
                                            name="phone"
                                            type="tel"
                                            placeholder="010-1234-5678"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none font-bold text-slate-900 transition-all"
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
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">문의 내용 *</label>
                                        <textarea
                                            required
                                            name="content"
                                            rows={4}
                                            placeholder="상담받으실 내용을 입력해 주세요."
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none font-bold text-slate-900 transition-all resize-none"
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
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">상담 접수 완료</h3>
                                        <p className="text-slate-500 font-bold leading-relaxed">
                                            정확하게 전달되었습니다. <br />
                                            담당 엔지니어가 곧 연락드리겠습니다.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="text-primary font-black text-xs uppercase tracking-[0.3em] hover:underline"
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
