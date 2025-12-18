import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { 
  User, Stethoscope, ShieldCheck, Activity, Server
} from "lucide-react";

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
      {/* Advanced animated background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-teal-900/20 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-teal-950/30" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/90" />
        
        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent animate-pulse" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/5 dark:bg-primary/10 animate-pulse"
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
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-teal-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_transparent_24px,_hsl(var(--border))_25px,_hsl(var(--border))_26px,_transparent_27px),_linear-gradient(to_bottom,_transparent_24px,_hsl(var(--border))_25px,_hsl(var(--border))_26px,_transparent_27px)] bg-[size:50px_50px] opacity-[0.02] dark:opacity-[0.03]" />
      </div>

      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">MediCare+</span>
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
            <span className="text-primary drop-shadow-lg">Patient Care</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed font-light">
            An advanced healthcare patient management system designed for healthcare professionals. 
            Streamline patient care, appointments, prescriptions, and payments in one secure platform.
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
        <p>&copy; 2025 MediCare+ Systems. All rights reserved. Secure Health Data Compliant.</p>
      </footer>
    </div>
  );
}
