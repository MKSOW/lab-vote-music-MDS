import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [initialized, setInitialized] = useState(false); // ✅ indicateur de chargement

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setInitialized(true); // ✅ on confirme que l’auth a été vérifiée
  }, []);

  function login(userData: any, token: string) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  }

  return { user, login, logout, initialized };
}
