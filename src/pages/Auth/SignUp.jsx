import React, { useState } from "react";
import auth from "./auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { Button, Divider, Form, Input, Upload, message } from "antd";
import { useAuth } from "../../context/authContext";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useFirebase } from "../../context/FirebaseContext";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const SignUp = () => {
  // const [formData, setFormData] = useState({
  //   username: "",
  //   email: "",
  //   password: "",
  //   name: "",
  // });
  // const { username, email, password, name } = formData;
  // const handleChange = (e) => {
  //   setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };
  const { signInGoogle } = useAuth();
  const { customUpload } = useFirebase();
  const [form] = Form.useForm();
  const [validateStatus, setValidateStatus] = useState("");
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [loadingForGoogle, setLoadingForGoogle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const navigate = useNavigate();

  // Upload Image
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const getFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // Check Username Exist
  const usernameExist = async (username) => {
    try {
      setValidateStatus("validating");
      const res = await api.get(`auth/username-exist?username=${username}`);
      if (!res.data.exist) {
        setValidateStatus("success");
      } else {
        setValidateStatus("error");
      }
    } catch (error) {
      console.log(error);
      setValidateStatus("error");
    }
  };
  // Handle Google Login
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
  // Handle Submit Register Form
  const handleSubmit = async (value) => {
    setSubmitBtnLoading(true);
    try {
      const res = await api.post("auth/register", value);
      message.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      message.error(error.response.data.error || "Something went wrong");
    }
    setSubmitBtnLoading(false);
  };
  return (
    <div className={auth.register}>
      <div className={auth.card}>
        <div className={auth.left}>
          <h1>Welcome To eatSocial </h1>  
          <p>
            eatSocial is a social media platform for foodies. You can share your
            food experiences with your friends and family. You can also follow
            your friends and family to see what they are eating. You can also
            follow your favorite restaurants to see what they are serving.And
            you can also Buy food which is favorite to you.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className={auth.right}>
          <h1>Register</h1>
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
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Register</button>
          </form> */}
          <Divider>or</Divider>
          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            scrollToFirstError
          >
            <Form.Item
              name="profilePic"
              getValueFromEvent={getFile}
              valuePropName="fileList"
              label="Profile Image"
              rules={[{ required: true, message: "Please select an image!" }]}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Upload
                name="profilePic"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={(options) => customUpload(options, "profilePic")}
                maxCount={1}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              hasFeedback
              validateStatus={validateStatus}
              help={
                validateStatus === "error" ? (
                  "Username already exist😤😤"
                ) : validateStatus === "success" ? (
                  <span style={{ color: "green" }}>Username Available😎😎</span>
                ) : null
              }
              rules={[
                {
                  validator: async (_, name) => {
                    const pattern = /^[a-zA-Z0-9_]+$/;
                    if (
                      !name ||
                      name.length < 5 ||
                      !pattern.test(name) ||
                      name.length > 15
                    ) {
                      setValidateStatus("");
                      return Promise.reject(
                        new Error(
                          "Username must be 5-15 characters long and can only contain letters, numbers and underscores!"
                        )
                      );
                    }
                    usernameExist(name);
                  },
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please Enter your Name!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please Enter your E-mail!",
                },
              ]}
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
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The confirm password does not match with the password!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "green",
                }}
                size="large"
                loading={submitBtnLoading}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
