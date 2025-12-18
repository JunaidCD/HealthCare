import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { 
  User, Stethoscope, ShieldCheck, Activity, Server
} from "lucide-react";
import healthcareBg from "@/assets/healthcare-bg.svg";

export function LandingPage() {
  const roles = [
    { id: "patient", label: "Patient", icon: User, color: "bg-blue-500" },
    { id: "doctor", label: "Doctor", icon: Stethoscope, color: "bg-teal-500" },
    { id: "admin", label: "Admin", icon: ShieldCheck, color: "bg-purple-500" },
    { id: "manager", label: "Manager", icon: Activity, color: "bg-orange-500" },
    { id: "it", label: "IT Staff", icon: Server, color: "bg-slate-500" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced healthcare-themed background */}
      <div className="absolute inset-0 z-0">
        {/* Blurred background image layer */}
        <div className="absolute inset-0 opacity-35 dark:opacity-25">
          <img
            src={healthcareBg}
            alt="Background"
            className="w-full h-full object-cover blur-2xl scale-110"
          />
        </div>

        {/* Base medical-themed gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-teal-900/20 to-purple-900/30 dark:from-blue-950/40 dark:via-teal-950/30 dark:to-purple-950/40" />
        
        {/* Medical cross pattern overlay */}
        <div className="absolute inset-0 opacity-20 dark:opacity-15">
          <div className="h-full w-full" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 60%),
              linear-gradient(45deg, transparent 48%, rgba(14, 165, 233, 0.05) 49%, rgba(14, 165, 233, 0.05) 51%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, rgba(20, 184, 166, 0.05) 49%, rgba(20, 184, 166, 0.05) 51%, transparent 52%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px'
          }} />
        </div>
        
        {/* DNA helix pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-8">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dna-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0,50 Q25,30 50,50 T100,50" stroke="rgba(14, 165, 233, 0.3)" strokeWidth="2" fill="none"/>
                <path d="M0,60 Q25,80 50,60 T100,60" stroke="rgba(20, 184, 166, 0.3)" strokeWidth="2" fill="none"/>
                <circle cx="25" cy="40" r="3" fill="rgba(14, 165, 233, 0.4)"/>
                <circle cx="75" cy="40" r="3" fill="rgba(14, 165, 233, 0.4)"/>
                <circle cx="25" cy="70" r="3" fill="rgba(20, 184, 166, 0.4)"/>
                <circle cx="75" cy="70" r="3" fill="rgba(20, 184, 166, 0.4)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dna-pattern)" />
          </svg>
        </div>
        
        {/* Medical grid pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-3" style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
        
        {/* Animated gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-pulse" />
        
        {/* Floating medical particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/8 dark:bg-primary/12 animate-pulse"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 3 + 2 + 's'
              }}
            />
          ))}
        </div>
        
        {/* Medical-themed blur shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/15 to-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-purple-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-teal-500/10 to-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Mental Health Care</span>
        </div>
        <ThemeToggle />
      </nav>

      <main className="relative z-10 container mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground animate-gradient bg-300">
              Next Generation
            </span>
            <br />
            <span className="text-primary drop-shadow-lg">Mental Health Care</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed font-light">
            A mental health care patient management system designed for healthcare professionals.
            Streamline appointments, prescriptions, and patient care workflows in one secure platform.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {roles.map((role) => (
            <Link key={role.id} href={`/login/${role.id}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full flex flex-col items-center justify-center gap-4 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
                <div className={`p-5 rounded-2xl ${role.color}/10 group-hover:${role.color}/20 transition-all duration-300 group-hover:scale-110 shadow-lg`}>
                  <role.icon className={`h-10 w-10 ${role.color.replace('bg-', 'text-')} transition-colors duration-300`} />
                </div>
                <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">{role.label}</span>
                <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">Login Portal →</span>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Link>
          ))}
        </motion.div>
      </main>
      
      <footer className="relative z-10 border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Mental Health Care Patient Management System. All rights reserved. Secure Health Data Compliant.</p>
      </footer>
    </div>
  );
}
