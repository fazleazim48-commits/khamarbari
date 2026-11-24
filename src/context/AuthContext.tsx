import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (emailOrPhone: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  register: (name: string, emailOrPhone: string, pass: string) => { success: boolean; message: string };
}

const AUTH_STORAGE_KEY = "kb_auth_user_v1";

// Default admin credentials
export const DEFAULT_ADMIN = {
  email: "fazleazim48@gmail.com",
  phone: "01819929185",
  password: "azim123@",
  name: "Fazle Azim",
  role: "admin" as const,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load auth user", e);
    }
  }, []);

  const login = (emailOrPhone: string, pass: string) => {
    const trimmedInput = emailOrPhone.trim().toLowerCase();
    const trimmedPass = pass.trim();

    // Check default admin
    if (
      (trimmedInput === DEFAULT_ADMIN.email.toLowerCase() || trimmedInput === DEFAULT_ADMIN.phone) &&
      trimmedPass === DEFAULT_ADMIN.password
    ) {
      const adminUser: User = {
        id: "admin-1",
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        phone: DEFAULT_ADMIN.phone,
        role: "admin",
      };
      setUser(adminUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      return { success: true, message: "অ্যাডমিন হিসেবে সফলভাবে লগইন হয়েছে!" };
    }

    // Check registered users
    try {
      const usersList: Array<User & { password?: string }> = JSON.parse(
        localStorage.getItem("kb_registered_users_v1") || "[]"
      );
      const match = usersList.find(
        (u) => (u.email.toLowerCase() === trimmedInput || u.phone === trimmedInput) && u.password === trimmedPass
      );
      if (match) {
        const cleanUser: User = {
          id: match.id,
          name: match.name,
          email: match.email,
          phone: match.phone,
          role: match.role || "user",
        };
        setUser(cleanUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(cleanUser));
        return { success: true, message: "স্বাগতম! আপনি সফলভাবে লগইন করেছেন।" };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      success: false,
      message: "ইমেইল/ফোন অথবা পাসওয়ার্ড সঠিক নয়। দয়া করে সঠিক তথ্য দিয়ে চেষ্টা করুন।",
    };
  };

  const register = (name: string, emailOrPhone: string, pass: string) => {
    try {
      const usersList: Array<User & { password?: string }> = JSON.parse(
        localStorage.getItem("kb_registered_users_v1") || "[]"
      );
      const exists = usersList.some(
        (u) => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
      );
      if (exists) {
        return { success: false, message: "এই ইমেইল বা ফোন নম্বরটি ইতিমধ্যে ব্যবহৃত হয়েছে।" };
      }

      const isEmail = emailOrPhone.includes("@");
      const newUser = {
        id: "user-" + Date.now(),
        name,
        email: isEmail ? emailOrPhone : "",
        phone: !isEmail ? emailOrPhone : "",
        password: pass,
        role: "user" as const,
      };

      usersList.push(newUser);
      localStorage.setItem("kb_registered_users_v1", JSON.stringify(usersList));

      const cleanUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: "user",
      };
      setUser(cleanUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(cleanUser));
      return { success: true, message: "নিবন্ধন সফল হয়েছে এবং আপনি লগইন করেছেন!" };
    } catch (e) {
      return { success: false, message: "নিবন্ধন করতে সমস্যা হয়েছে।" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
