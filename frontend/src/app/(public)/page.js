

// app/page.jsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  UsersRound,
  MessageSquare,
  Calendar,
  FileCheck,
  Briefcase,
  Users,
  Workflow,
  Bug,
  BarChart3,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-sky-100 text-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* HEADER */}
      <header className="relative z-50 fixed top-0 w-full border-b border-blue-100 bg-white/80 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-sky-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text">
              BluePrint
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-white hover:bg-blue-500/80 border border-blue-500/30 transition-all duration-300"
              >
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-105">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 text-sm font-medium">
                <Zap className="w-4 h-4" />
                Next-Gen Project Management
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-400">
                  Project Management
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-400">
                  Reimagined
                </span>
              </h1>

              <p className="max-w-2xl text-xl text-gray-600 leading-relaxed">
                Transform your workflow with our revolutionary project management platform.
                Collaborate seamlessly, deliver faster, and achieve extraordinary results.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mt-8">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold transition-all duration-300"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-500">
                  Power-Packed Features
                </span>
                <br />
                <span className="text-gray-900">To Elevate Your Workflow</span>
              </h2>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                Discover a suite of tools designed to streamline every aspect of your project management journey.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-blue-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-12 py-4 text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105"
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
      <footer className="relative z-10 border-t border-indigo-100 bg-white/80 backdrop-blur-xl py-12 mt-24">
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text">
              BluePrint
            </span>
          </div>
          <p className="text-gray-500">
            © 2025 BluePrint. Revolutionizing project management worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Client Management",
    description: "Centralized client profiles with integrated communication, document sharing, and progress tracking for seamless client interactions.",
    icon: UsersRound,
  },
  {
    title: "Contact Organization",
    description: "Effortlessly manage contacts with smart categorization, quick search, and automated follow-up reminders.",
    icon: MessageSquare,
  },
  {
    title: "Meeting Scheduler",
    description: "Streamlined meeting planning with calendar integration, automated invites, and real-time availability tracking.",
    icon: Calendar,
  },
  {
    title: "Quotation Builder",
    description: "Create professional quotes with customizable templates, automated calculations, and instant client delivery.",
    icon: FileCheck,
  },
  {
    title: "Project Oversight",
    description: "Comprehensive project management with milestones, timelines, and real-time progress monitoring for flawless execution.",
    icon: Briefcase,
  },
  {
    title: "Team Collaboration",
    description: "Foster teamwork with shared workspaces, live updates, and integrated communication tools for maximum efficiency.",
    icon: Users,
  },
  {
    title: "Task Automation",
    description: "Automate repetitive tasks with intelligent workflows, priority detection, and deadline optimization.",
    icon: Workflow,
  },
  {
    title: "Bug Tracking",
    description: "Efficiently track and resolve bugs with prioritized ticketing, detailed reporting, and team assignment features.",
    icon: Bug,
  },
  {
    title: "Insightful Reports",
    description: "Generate actionable insights with customizable dashboards, predictive analytics, and performance tracking.",
    icon: BarChart3,
  },
];