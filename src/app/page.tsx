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

import ProcessDiagnostics from "@/components/ProcessDiagnostics";
import TechStackCurator from "@/components/TechStackCurator";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Hero />
      <Services />
      <ProjectTimeline />
      <CoreValues />
      <ProcessSimulator />
      <TechStackCurator />

      {/* Diagnostic Tool Section */}
      <section id="insights" className="section-padding bg-slate-950 relative border-t border-slate-900">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-3xl md:text-[2.4vw] font-black tracking-tighter leading-none text-white uppercase">PROCESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">INTELLIGENCE</span></h2>
            <p className="text-xl text-slate-400 font-medium tracking-tight">
              귀사의 공정은 얼마나 스마트합니까? <br className="hidden md:block" />
              SNPE의 AI 진단 도구로 지능화 수치를 측정하고 디지털 전환 로드맵을 확인하세요.
            </p>
          </div>
          <ProcessDiagnostics />
        </div>
      </section>

      <QuoteGuide />
      <LeadGen />
      <Footer />
    </main>
  );
}
