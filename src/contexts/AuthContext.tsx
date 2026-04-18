// ════════════════════════════════════════════════════════════════════════
// AuthContext.tsx — Mis à jour avec rôle Client
// ════════════════════════════════════════════════════════════════════════
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "manager" | "employee" | "client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: UserRole;
  departement?: string;
  // Champs spécifiques client
  telephone?: string;
  ville?: string;
  dossiersIds?: string[]; // IDs des dossiers accessibles au client
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  isClient: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

// ─── Utilisateurs de démo ────────────────────────────────────────────────────
const DEMO_USERS: (AuthUser & { password: string })[] = [
  {
    id: "U001",
    name: "Admin Manager",
    email: "admin@accessmorocco.ma",
    password: "admin123",
    initials: "AM",
    role: "admin",
  },
  {
    id: "U002",
    name: "Karim Hamdoune",
    email: "manager.mice@accessmorocco.ma",
    password: "manager123",
    initials: "KH",
    role: "manager",
    departement: "MICE",
  },
  {
    id: "U003",
    name: "Sara Benkirane",
    email: "manager.outbound@accessmorocco.ma",
    password: "manager123",
    initials: "SB",
    role: "manager",
    departement: "Outbound",
  },
  {
    id: "U004",
    name: "Youssef El Amrani",
    email: "employe@accessmorocco.ma",
    password: "employe123",
    initials: "YE",
    role: "employee",
  },
  // ── Comptes clients ───────────────────────────────────────────────────
  {
    id: "CL001",
    name: "Rim Sentissi",
    email: "rim.sentissi@gmail.com",
    password: "client123",
    initials: "RS",
    role: "client",
    telephone: "+212 6 44 55 66 77",
    ville: "Casablanca",
    dossiersIds: ["DOS012", "DOS019"],
  },
  {
    id: "CL002",
    name: "Christie Rogers",
    email: "christie.rogers@brightspot.com",
    password: "client123",
    initials: "CR",
    role: "client",
    telephone: "+1 310 555 0142",
    ville: "Los Angeles",
    dossiersIds: ["DOS012"],
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Email ou mot de passe incorrect" };
    const { password: _, ...userWithoutPassword } = found;
    setUser(userWithoutPassword);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.role === "admin",
      isManager: user?.role === "manager",
      isEmployee: user?.role === "employee",
      isClient: user?.role === "client",
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}