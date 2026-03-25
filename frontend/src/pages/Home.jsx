import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, TrendingDown, Moon, Sun, Search, AlertTriangle, Cpu, FileText, ArrowRight, BarChart3, Lock, CheckCircle2, Bot } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Home() {
  const { isDarkMode, toggleTheme } = useTheme();

  // Scroll Reveal Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-12');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          // Important: unobserve after revealing so it doesn't animate out when scrolling back up
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const agents = [
    {
      title: "Spend Intelligence",
      description: "Dig deeply into procurement, vendor, and operations data to find anomalies and duplicate costs.",
      icon: <Search className="w-6 h-6 text-blue-500" />,
      color: "from-blue-500/20 to-blue-600/20 border-blue-500/20"
    },
    {
      title: "SLA Prevention",
      description: "Detect approaching SLA breaches from real-time operational signals to stop financial penalties.",
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      color: "from-amber-500/20 to-amber-600/20 border-amber-500/20"
    },
    {
      title: "Resource Optimizer",
      description: "Continuously monitor cross-tool utilization. Recommend and execute automated consolidations securely.",
      icon: <Cpu className="w-6 h-6 text-emerald-500" />,
      color: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/20"
    },
    {
      title: "FinOps Hub",
      description: "Reconcile transactions, flag discrepancies, and produce deep variance analyses with root-cause tracking.",
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      color: "from-purple-500/20 to-purple-600/20 border-purple-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background text-slate-900 dark:text-gray-100 transition-colors duration-300 font-sans selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 relative group cursor-pointer">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-500"></div>
              <Shield className="h-7 w-7 text-primary relative z-10 animate-pulse-slow" />
              <span className="font-bold text-xl tracking-tight relative z-10 text-gray-900 dark:text-white">
                CostGuard <span className="text-primary tracking-normal">AI</span>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:ring-2 focus:ring-primary/50 outline-none"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-gray-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-sm font-medium rounded-lg transition-all active:scale-95 shadow-sm text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 mt-6 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="text-left flex flex-col justify-center animate-fade-in-up opacity-0 delay-100">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm text-xs sm:text-sm mb-6 shadow-sm w-fit">
              <span className="relative flex h-2 w-2 mr-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-primary font-semibold tracking-wide">
                CostGuard AI Core 2.0 Live
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.15]">
              Eliminate Cloud Waste. <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent pb-2 lg:pb-4 inline-block mt-2">
                Autonomously.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl">
              Stop relying on manual spreadsheets. CostGuard AI continuously monitors your enterprise footprint to automatically terminate idle resources, negotiate licenses, and protect SLAs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start w-full">
              <Link 
                to="/login" 
                className="group flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:scale-95"
              >
                Start Free Analysis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="group flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-medium rounded-xl transition-all border border-gray-200 dark:border-white/10 hover:-translate-y-1 active:scale-95"
              >
                View Live Demo
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-background bg-gradient-to-br from-gray-200 to-gray-300 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-xs font-bold ${i === 4 ? 'z-10 bg-primary text-white' : 'z-' + (4-i)*10}`}>
                    {i === 4 ? '+' : ''}
                  </div>
                ))}
              </div>
              <p>Trusted by <strong className="text-gray-900 dark:text-white">500+</strong> FinOps Teams</p>
            </div>
          </div>

          {/* Right Column: Simulated AI Dashboard */}
          <div className="relative animate-fade-in-up opacity-0 delay-[300ms] lg:ml-auto w-full max-w-lg mt-10 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-[80px] rounded-full"></div>
            
            <div className="relative glass-card rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl p-1 bg-white/50 dark:bg-surface/50 backdrop-blur-2xl">
              {/* Fake Window Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 rounded-t-xl">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="mx-auto text-xs font-mono text-gray-500 flex items-center gap-2">
                  <Lock size={10} /> agent-optimizer.exe
                </div>
              </div>
              
              {/* Fake Interface Content */}
              <div className="p-6 space-y-6">
                
                {/* Live Scan Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bot className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Active Scans Running</h4>
                      <p className="text-xs text-gray-500">24 AWS Accounts • 12 Azure Subs</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">Processing</span>
                </div>

                {/* Simulated Anomalies Array */}
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-white/5 bg-white dark:bg-black/20 flex items-center justify-between group hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Idle EC2 Instance Detected</span>
                    </div>
                    <span className="text-sm font-bold text-amber-500">₹45,000/mo</span>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-white/5 bg-white dark:bg-black/20 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Downgrade RDS Tier</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-500">₹12,500/mo</span>
                  </div>

                  <div className="p-3 rounded-lg border border-gray-100 dark:border-white/5 bg-white dark:bg-black/20 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Duplicate SaaS Seats (Jira)</span>
                    </div>
                    <span className="text-sm font-bold text-blue-500">₹24,000/mo</span>
                  </div>
                </div>

                {/* Fake Terminal execution logs */}
                <div className="p-4 bg-gray-900 rounded-xl font-mono text-xs text-emerald-400 border border-gray-800">
                  <p className="mb-1 text-gray-500">{'>'} Initiating autonomous remediation...</p>
                  <p className="mb-1">{'>'} Routing approval to Enterprise Admin...</p>
                  <p className="mb-1 text-primary">{'>'} Approval received. Terminating Idle EC2...</p>
                  <p className="text-white mt-2 border-t border-gray-800 pt-2">Total Yield: <span className="text-emerald-400 font-bold">+₹81,500/mo Savings</span></p>
                </div>
                
              </div>
            </div>
            
            {/* Floating ornamental element */}
            <div className="absolute -bottom-6 -right-6 animate-float delay-300 glass-card p-4 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center gap-3 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Optimization</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Executed</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-12 border-y border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center divide-x-0 md:divide-x divide-y md:divide-y-0 divide-gray-200 dark:divide-white/5">
            <div className="p-4 md:p-0">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">32%</p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Avg Cost Reduction</p>
            </div>
            <div className="p-4 md:p-0">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">2.4M+</p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Anomalies Detected</p>
            </div>
            <div className="p-4 md:p-0 border-t md:border-t-0">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">99.9%</p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">SLA Protection Rate</p>
            </div>
            <div className="p-4 md:p-0 border-t md:border-t-0">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">500+</p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Enterprise Integrations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Agents Grid */}
      <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 overflow-hidden">
        <div className="scroll-reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Enterprise-Grade AI Architecture</h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">Four specialized agents working in unison to provide 360-degree cost intelligence and operational stability.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, index) => (
            <div 
              key={index} 
              className={`scroll-reveal opacity-0 translate-y-12 bg-white dark:bg-surface border border-gray-200 dark:border-white/10 p-8 rounded-2xl hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-[800ms] hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(59,130,246,0.3)] ease-out group relative overflow-hidden`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${agent.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-6 text-gray-700 dark:text-white group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white dark:group-hover:bg-surface transition-all duration-300 shadow-sm relative z-10">
                {agent.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10 group-hover:text-primary transition-colors duration-300">
                {agent.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm relative z-10">
                {agent.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="py-10 md:py-16 mb-4 md:mb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 overflow-hidden">
        <div className="scroll-reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out bg-gray-900 dark:bg-surface border border-gray-800 dark:border-white/10 rounded-3xl p-8 sm:p-10 md:p-16 relative shadow-2xl group hover:border-gray-700 dark:hover:border-white/20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3 group-hover:bg-primary/30 transition-colors duration-700"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-blue-300 uppercase tracking-widest mb-6 backdrop-blur-md">
                <Lock size={12} /> Military Grade Security
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Safe, Human-in-the-Loop Execution</h2>
              <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                Our autonomous agents investigate deeply but act securely. Every high-risk modification or financial transaction is mapped through an enterprise approval workflow. You retain absolute control over your infrastructure.
              </p>
              <ul className="space-y-4">
                {['Role-based approval gating', 'Comprehensive audit logs & playbooks', 'Zero-trust architecture matching'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 font-medium">
                    <CheckCircle2 className="text-emerald-400 w-5 h-5 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/10 pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-white mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-bold tracking-tight">CostGuard AI</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enterprise cost intelligence mapped for the modern cloud era.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">© 2026 CostGuard Enterprise Platform. All rights reserved.</p>
      </footer>

      {/* Ambient Background Splashes */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-secondary/5 rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
}
