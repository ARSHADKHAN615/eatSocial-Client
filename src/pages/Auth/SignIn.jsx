import React, { useState } from "react";
import auth from "./auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useFirebase } from "../../context/FirebaseContext";
import { Button, Divider, Form, Input } from "antd";

const SignIn = () => {
  const { login, signInGoogle } = useAuth();
  const navigate = useNavigate();
  const [loadingForGoogle, setLoadingForGoogle] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleLogin = async () => {
    setLoadingForGoogle(true);
    try {
      const res = await signInGoogle();
      if (res) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingForGoogle(false);
  };

  const handleLogin = async (value) => {
    setSubmitBtnLoading(true);
    try {
      const res = await login(value);
      if (res) {
        navigate("/");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    setSubmitBtnLoading(false);
  };
  return (
    <div className={auth.login}>
      <div className={auth.card}>
        <div className={auth.left}>
        <h1>WELCOME BACK</h1>
          {/* 
          <p>
            eatSocial is a social media platform for foodies. You can share your food experiences with your friends and family. You can also follow your friends and family to see what they are eating. You can also follow your favorite restaurants to see what they are serving.And you can also Buy food which is favorite to you.
          </p>
          */}
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link> 
        </div>
        <div className={auth.right}>
          <h1>Sign In</h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              size="large"
              style={{ width: "100%" }}
              onClick={handleGoogleLogin}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{
                    marginRight: "0.5rem",
                    width: "1.5rem",
                    height: "1.5rem",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="2443"
                  height="2500"
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  />
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  />
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  />
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  />
                </svg>
                Sign In with Google
                {loadingForGoogle && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={{
                      margin: "0",
                      background: "transparent",
                      shapeRendering: "auto",
                    }}
                    width="1.7rem"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                  >
                    <rect x="17.5" y="30" width="15" height="40" fill="#4285f4">
                      <animate
                        attributeName="y"
                        repeatCount="indefinite"
                        dur="1s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="18;30;30"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                        begin="-0.2s"
                      ></animate>
                      <animate
                        attributeName="height"
                        repeatCount="indefinite"
                        dur="1s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="64;40;40"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                        begin="-0.2s"
                      ></animate>
                    </rect>
                    <rect x="42.5" y="30" width="15" height="40" fill="#34a853">
                      <animate
                        attributeName="y"
                        repeatCount="indefinite"
                        dur="1s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="20.999999999999996;30;30"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                        begin="-0.1s"
                      ></animate>
                      <animate
                        attributeName="height"
                        repeatCount="indefinite"
                        dur="1s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="58.00000000000001;40;40"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                        begin="-0.1s"
                      ></animate>
                    </rect>
                    <rect x="67.5" y="30" width="15" height="40" fill="#fbbc05">
                      <animate
                        attributeName="y"
                        repeatCount="indefinite"
                        dur="1s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="20.999999999999996;30;30"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                      ></animate>
                      <animate
                        attributeName="height"
                        repeatCount="indefinite"
                        dur="1s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        values="58.00000000000001;40;40"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                      ></animate>
                    </rect>
                  </svg>
                )}
              </div>
            </Button>
          </div>
          {/* <form>
            <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
            <button onClick={handleLogin}>Login</button>
          </form> */}
          <Divider>or</Divider>
          <Form
            onFinish={handleLogin}
            layout="vertical"
            scrollToFirstError
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please Enter your Username!",
                },
              ]}
              hasFeedback
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please Enter your Password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" ,backgroundColor:"green"}}
                size="large"
                loading={submitBtnLoading}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
