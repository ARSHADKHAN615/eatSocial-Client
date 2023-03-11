import "./share.scss";
import { useAuth } from "../../context/authContext";
import { Button, Form, Input, Upload, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api";
import HandlePost from "../formModel/HandlePost";
import { useState } from "react";

const Share = () => {
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const mutation = useMutation((newPost) => createPost(newPost), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("posts");
      message.success("Post created successfully");
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.response.data.error || "Something went wrong");
    },
  });

  const propsUpload = {
    name: "file",
    action: `${import.meta.env.VITE_API_URL}upload`,
    withCredentials: true,
    credentials: "include",
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    listType: "picture",
    maxCount: 1,
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    mutation.mutate(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    // <Form
    //   name="basic"
    //   form={form}
    //   onFinish={onFinish}
    //   onFinishFailed={onFinishFailed}
    //   autoComplete="off"
    // >
    //   {/* <div className="share">
    //     <div className="container">
    //       <div className="top">
    //         <div className="left">
    //           <img
    //             src={
    //               currentUser.profilePic
    //                 ? currentUser.profilePic
    //                 : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${currentUser?.name}`
    //             }
    //             alt={currentUser?.name}
    //           />
    //           <Form.Item
    //             name="desc"
    //             rules={[
    //               { required: true, message: "Please input your username!" },
    //             ]}
    //             style={{ width: "100%", margin: 0 }}
    //           >
    //             <Input
    //               bordered={false}
    //               placeholder={`What's on your mind ${currentUser.name}?`}
    //               style={{ width: "100%" }}
    //             />
    //           </Form.Item>
    //         </div>
    //       </div>
    //       <hr />
    //       <div className="bottom">
    //         <div className="left">
    //           <div>
    //             <Form.Item
    //               name="img"
    //               getValueFromEvent={(e) => {
    //                 if (Array.isArray(e)) {
    //                   return e;
    //                 }
    //                 return e && e.fileList;
    //               }}
    //               valuePropName="fileList"
    //               style={{ width: "100%", margin: 0 }}
    //             >
    //               <Upload {...propsUpload} style={{ width: "100%" }}>
    //                 <Button>Click to Upload</Button>
    //               </Upload>
    //             </Form.Item>
    //           </div>
    //           <div className="item">
    //             <img src={Map} alt="" />
    //             <span>Add Place</span>
    //           </div>
    //           <div className="item">
    //             <img src={Friend} alt="" />
    //             <span>Tag Friends</span>
    //           </div>
    //         </div>
    //         <div className="right">
    //           <button>Share</button>
    //         </div>
    //       </div>
    //     </div>
    //   </div> */}

    // </Form>
    <div className="share">
      <div className="container">
        <div className="right">
          <button className="shareButton" onClick={() => setIsPostModalOpen(true)}>
            Share
          </button>
        </div>
      </div>
      <HandlePost
        isOpen={isPostModalOpen}
        setIsOpen={setIsPostModalOpen}
        post={null}
      />
    </div>
  );
};

export default Share;
