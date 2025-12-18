import React, { createContext, useContext, useState, useEffect } from "react";
import { User, MOCK_USERS, Role } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem("health_care_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: Role) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find((u) => u.email === email && u.role === role);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("health_care_user", JSON.stringify(foundUser));
      toast({
        title: "Welcome back",
        description: `Logged in as ${foundUser.name}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials or role mismatch.",
      });
      throw new Error("Invalid credentials");
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("health_care_user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
