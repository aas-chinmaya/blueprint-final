"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  ClipboardList,
  Users,
  BarChart3,
  FileText,
  Briefcase,
  Workflow,
  Sparkles,
  Zap
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-lime-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* HEADER */}
      <header className="relative z-50 fixed top-0 w-full border-b border-green-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              BluePrint
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-green-300 hover:text-white hover:bg-green-500/20 border border-green-500/30 transition-all duration-300"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 min-h-screen flex items-center">
          <div className="container max-w-6xl mx-auto px-6 text-center">
            <div className="flex flex-col items-center gap-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-300 text-sm font-medium">
                <Zap className="w-4 h-4" />
                Next-Gen Project Management
              </div>
              
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none">
                <span className="bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent">
                  Project Management
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>
              
              <p className="max-w-2xl text-xl text-gray-300 leading-relaxed">
                Transform your workflow with our revolutionary project management platform. 
                Collaborate seamlessly, deliver faster, and achieve extraordinary results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mt-8">
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-green-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/40"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-green-500/50 text-green-300 hover:bg-green-500/10 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Everything You Need
                </span>
                <br />
                <span className="text-white">To Dominate Your Projects</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Packed with cutting-edge features designed to supercharge your productivity
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 hover:transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 group-hover:border-green-400/50 transition-colors duration-300">
                        <div className="text-green-400 group-hover:text-green-300 transition-colors duration-300">
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-100 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/login">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-4 text-lg font-semibold shadow-2xl shadow-green-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-green-500/20 bg-slate-900/80 backdrop-blur-xl py-12 mt-24">
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              BluePrint
            </span>
          </div>
          <p className="text-gray-400">
            © 2025 BluePrint. Revolutionizing project management worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Smart Task Management",
    description: "AI-powered task creation and assignment with intelligent priority detection and automated deadline optimization.",
    icon: <ClipboardList className="w-6 h-6" />,
  },
  {
    title: "Real-time Collaboration",
    description: "Seamless team communication with instant updates, live editing, and integrated video conferencing.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: "Advanced Analytics",
    description: "Deep insights with predictive analytics, performance forecasting, and customizable dashboards.",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    title: "Client Portal Pro",
    description: "Branded client spaces with real-time progress sharing, feedback collection, and secure file exchange.",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    title: "Resource Optimization",
    description: "Intelligent resource allocation with capacity planning, bottleneck detection, and workload balancing.",
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    title: "Custom Workflows",
    description: "Drag-and-drop workflow builder with automation rules, conditional logic, and integration capabilities.",
    icon: <Workflow className="w-6 h-6" />,
  },
];