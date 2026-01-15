import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // load từ localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("app_user");
    const savedToken = localStorage.getItem("app_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (token: string, user: User) => {
    setUser(user);
    setToken(token);

    localStorage.setItem("app_user", JSON.stringify(user));
    localStorage.setItem("app_token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("app_user");
    localStorage.removeItem("app_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
