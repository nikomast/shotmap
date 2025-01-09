import React, { createContext, useState, useContext, useEffect } from "react";
import { refreshToken } from "../../utility/api"; 

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const accessToken = localStorage.getItem("access");
    return accessToken ? { accessToken } : null;
  });

  const login = (userData) => {
    localStorage.setItem("access", userData.access);
    localStorage.setItem("refresh", userData.refresh);
    setUser({ accessToken: userData.access });
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  const refreshAccessToken = async () => {
    try {
      const newAccessToken = await refreshToken(); 
      localStorage.setItem("access", newAccessToken);
      setUser({ accessToken: newAccessToken });
    } catch (error) {
      console.error("Token refresh failed. Logging out the user.", error);
      logout(); 
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem("refresh")) {
        refreshAccessToken(); 
      }
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("access");
    if (!storedToken) {
      setUser(null); 
    }
  }, []);

  return (
    <LoginContext.Provider value={{ user, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
