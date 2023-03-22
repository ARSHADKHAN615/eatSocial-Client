import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { message } from "antd";
import { useFirebase } from "./FirebaseContext";

export const AuthContext = createContext(null);

// useDarkMode Context
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const { signInGoogleProvider } = useFirebase();
  const login = async(data) => {
    try {
      const res = await api.post("auth/login", data);
      setCurrentUser(res.data);
      return res.data;
    } catch (error) {
      message.error(error.response.data.error || "Something went wrong");
    }
  };

  const signInGoogle = async () => {
    try {
      const result = await signInGoogleProvider();
      const res = await api.post("auth/google", {
        name: result.user.displayName,
        email: result.user.email,
        img: result.user.photoURL,
      });
      console.log(res);
      setCurrentUser(res.data);
    } catch (error) {
      message.error(error.message.split(":")[1]);
      console.log(error.message.split(":")[1]);
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
    <AuthContext.Provider value={{ currentUser, login , setCurrentUser, logout , signInGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};
