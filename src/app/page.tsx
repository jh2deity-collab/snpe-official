import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import LeadGen from "@/components/LeadGen";
import Footer from "@/components/Footer";
import ProcessSimulator from "@/components/ProcessSimulator";
import ProjectTimeline from "@/components/ProjectTimeline";
import QuoteGuide from "@/components/QuoteGuide";
import CoreValues from "@/components/CoreValues";

import ROICalculator from "@/components/ROICalculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Hero />
      <Services />
      <ProjectTimeline />
      <CoreValues />
      <ProcessSimulator />

      {/* ROI Calculator Section */}
      <section id="insights" className="section-padding bg-slate-950 relative border-t border-slate-900">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl md:text-[3vw] font-black tracking-tighter leading-none text-white">ECONOMIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">VALUE</span></h2>
            <p className="text-xl text-slate-400 font-medium tracking-tight">
              SNPE의 지능형 최적화 솔루션은 단순한 자동화를 넘어 <br className="hidden md:block" />
              귀사의 비즈니스에 실질적인 경제적 이득을 선사합니다.
            </p>
          </div>
          <ROICalculator />
        </div>
      </section>

      <QuoteGuide />
      <LeadGen />
      <Footer />
    </main>
  );
}
