import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "employee";

interface User {
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  department?: string;
}

const DEMO_USERS: Record<string, User & { password: string }> = {
  "admin@accessmorocco.ma": {
    name: "Admin Manager",
    email: "admin@accessmorocco.ma",
    password: "admin123",
    role: "admin",
    initials: "AM",
  },
  "employe@accessmorocco.ma": {
    name: "Youssef El Amrani",
    email: "employe@accessmorocco.ma",
    password: "employe123",
    role: "employee",
    initials: "YE",
    department: "Hajj & Omra",
  },
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    const found = DEMO_USERS[email.toLowerCase()];
    if (!found) return { success: false, error: "Utilisateur introuvable" };
    if (found.password !== password) return { success: false, error: "Mot de passe incorrect" };
    const { password: _, ...userData } = found;
    setUser(userData);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isEmployee: user?.role === "employee",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
