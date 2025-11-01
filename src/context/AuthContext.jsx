import { createContext, useContext, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = (data) => {
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setTimeout(() => {
      setToken(null);
      localStorage.removeItem("token");
    }, 1);
  };

  return (
    <AuthCtx.Provider value={{ token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
