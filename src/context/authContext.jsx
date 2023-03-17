import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { message } from "antd";

export const AuthContext = createContext(null);

// useDarkMode Context
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  
  const login = async(data) => {
    try {
      const res = await api.post("auth/login", data);
      setCurrentUser(res.data);
      return res.data;
    } catch (error) {
      message.error(error.response.data.error || "Something went wrong");
    }
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser?.name]);

  return (
    <AuthContext.Provider value={{ currentUser, login , setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
