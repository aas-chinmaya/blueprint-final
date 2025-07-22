

// 'use client';
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Users, Zap, Shield } from "lucide-react";

// export function HeroBlock() {
//   return (
//     <section className="relative w-full py-20 md:py-32  overflow-hidden">
//       {/* Dark overlay for smooth gradient effect only in dark mode */}
//       <div className="absolute inset-0 z-0 " />

//       <div className="relative z-10 container mx-auto px-4 md:px-6">
//         <div className="flex flex-col items-center space-y-12 text-center">
//           <div className="space-y-6 max-w-4xl">
//             <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
//               Welcome to{" "}
//               <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
//                 BluePrint
//               </span>
//             </h1>
//             <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
//               Manage tasks, sprints, and your team — all in one internal dashboard.
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <Button size="lg" className="gap-2 px-8">
//               Enter Dashboard
//               <ArrowRight className="h-4 w-4" />
//             </Button>
//             <Button variant="outline" size="lg">
//               View SOPs
//             </Button>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 pt-8 max-w-4xl">
//             {[{
//               icon: Users, title: "Team Roles", desc: "Assign & track responsibilities across departments."
//             }, {
//               icon: Zap, title: "Speed-Oriented", desc: "Minimal UI & fast flows optimized for internal teams."
//             }, {
//               icon: Shield, title: "Secure", desc: "Access-controlled, encrypted, and internal only."
//             }].map(({ icon: Icon, title, desc }) => (
//               <div
//                 key={title}
//                 className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card border"
//               >
//                 <div className="p-3 bg-primary/10 rounded-full">
//                   <Icon className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="font-semibold">{title}</h3>
//                 <p className="text-sm text-muted-foreground text-center">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
'use client';
import {
  LineChart,
  Briefcase,
  CalendarClock,
  FileText,
  FileSignature,
  Bug,
  Users,
  ClipboardList,
  Contact2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ================== Hero Section =====================
export function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-muted/5 text-center ">
      <div className="container mx-auto px-4 md:px-6 space-y-8 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Manage Everything in{" "}
          <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
            One Workspace
          </span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          From tasks to meetings, bugs to quotations — streamline your team’s
          daily operations with a unified internal dashboard.
        </p>
        <div className="flex justify-center flex-col sm:flex-row gap-4 pt-4">
          <Button size="lg" className="gap-2 px-8">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}

// ================== Features Section =====================
export function FeatureSection() {
  const features = [

    {
      icon: Briefcase,
      title: "Projects",
      desc: "Track progress, goals, deliverables, and dependencies.",
    },
    {
      icon: CalendarClock,
      title: "Meetings",
      desc: "Plan and manage team/client meetings with follow-ups.",
    },
    {
      icon: FileText,
      title: "MOM",
      desc: "Auto-capture meeting notes and share detailed outcomes.",
    },
    {
      icon: FileSignature,
      title: "Quotations",
      desc: "Create, manage, and track business quotations seamlessly.",
    },
    {
      icon: Bug,
      title: "Bug Reports",
      desc: "Log, track, and resolve issues collaboratively.",
    },
    {
      icon: Users,
      title: "Team Management",
      desc: "Assign roles, track performance, and coordinate easily.",
    },
    {
      icon: ClipboardList,
      title: "Task Manager",
      desc: "Manage daily tasks, status, and deadlines in one view.",
    },
    {
      icon: Contact2,
      title: "Client & Contact Book",
      desc: "Store, update, and search all client/stakeholder contacts.",
    },
  ];

  return (
    <section className="w-full py-20 md:py-28 bg-muted/5 ">
      <div className="container mx-auto px-4 md:px-6 text-center space-y-10">
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Our —{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            No more juggling between apps. Every key workflow lives here — organized, accessible, and optimized.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center space-y-3 p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-primary/10 rounded-full">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-lg">{title}</h4>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
