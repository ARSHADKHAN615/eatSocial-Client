import React, { useState } from "react";
import auth from "./auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      if (res) {
        navigate("/");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={auth.login}>
      <div className={auth.card}>
        <div className={auth.left}>
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className={auth.right}>
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
