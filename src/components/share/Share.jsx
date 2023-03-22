import "./share.scss";
import { useAuth } from "../../context/authContext";
import { Button, Form, Input, Upload, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
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

  return (
    <div className="share">
      <div className="container">
        <div className="right">
          <Button onClick={() => setIsPostModalOpen(true)} type="primary" icon={<PlusCircleOutlined />} shape="round" size="large"> Create Post</Button>
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
