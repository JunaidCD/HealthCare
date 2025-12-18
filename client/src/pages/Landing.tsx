import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import bgImage from "@assets/generated_images/abstract_medical_technology_background_dark.png";
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
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-20 dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/90" />
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
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Next Generation <br />
            <span className="text-primary">Patient Care</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
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
              <div className="group relative overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full flex flex-col items-center justify-center gap-4">
                <div className={`p-4 rounded-full ${role.color}/10 group-hover:${role.color}/20 transition-colors`}>
                  <role.icon className={`h-8 w-8 ${role.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="font-semibold text-lg">{role.label}</span>
                <span className="text-xs text-muted-foreground">Login Portal &rarr;</span>
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
