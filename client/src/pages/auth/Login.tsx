import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface LoginPageProps {
  role: Role;
}

export function LoginPage({ role }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Pre-fill for demo purposes
  const demoCredentials = {
    patient: "patient@health.care",
    doctor: "doctor@health.care",
    admin: "admin@health.care",
    manager: "manager@health.care",
    it: "it@health.care",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, role);
      setLocation(`/dashboard/${role}`);
    } catch (error) {
      // Error is handled by toast in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
       </div>

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="absolute top-6 left-6 z-20">
        <Button variant="ghost" onClick={() => setLocation("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10 px-4"
      >
        <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold capitalize">
              {role} Login
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the secure portal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full text-white font-semibold" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
              <div className="text-center text-xs text-muted-foreground">
                <p>Demo Credentials:</p>
                <code className="bg-muted px-2 py-1 rounded mt-1 inline-block cursor-pointer hover:text-primary transition-colors"
                      onClick={() => {
                        setEmail(demoCredentials[role]);
                        setPassword("password");
                      }}>
                  {demoCredentials[role]} / password
                </code>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
