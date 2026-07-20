// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getPrefixForRole } from "../utils/rolePrefix";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [outlet, setOutlet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedOutlet = localStorage.getItem("outlet");

    if (storedToken) setToken(storedToken);
    if (storedUser && storedUser !== "undefined") setUser(JSON.parse(storedUser));
    if (storedOutlet && storedOutlet !== "undefined") setOutlet(JSON.parse(storedOutlet));
    setLoading(false);
  }, []);

  const login = (token, user, outlet) => {
    setToken(token);
    setUser(user);
    setOutlet(outlet);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("outlet", JSON.stringify(outlet));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("outlet");
  };

  const routePrefix = getPrefixForRole(user?.role);

  return (
    <AuthContext.Provider
      value={{ user, token, outlet, login, logout, loading, routePrefix }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
