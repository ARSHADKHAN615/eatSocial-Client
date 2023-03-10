import { Button, Form, Input, Modal, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api";
import { useFirebase } from "../context/FirebaseContext";
import { useAuth } from "../context/authContext";

const UpdateProfile = ({ isOpen, setIsOpen, profile }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { setCurrentUser } = useAuth();
  const { customUpload } = useFirebase();

  const handleCancel = () => {
    setIsOpen(false);
  };
  const mutation = useMutation((updatedUser) => updateProfile(updatedUser), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("profile");
      message.success("Profile updated successfully");
      handleCancel();
      setCurrentUser((prev) => ({ ...prev, name: form.getFieldValue("name") }));
    },
    onError: (error) => {
      message.error(error.response.data.error || "Something went wrong");
    },
  });

  const onFinish = (values) => {
    mutation.mutate(values);
    // console.log("Success:", values);
  };

  const initialValues = {
    name: profile?.name,
    city: profile?.city,
    website: profile?.website,
    profilePic: profile?.profilePic
      ? [
          {
            uid: "-1",
            name: "profilePic.png",
            status: "done",
            url: profile?.profilePic,
          },
        ]
      : [],
    coverPic: profile?.coverPic
      ? [
          {
            uid: "-2",
            name: profile?.coverPic,
            status: "done",
            url: profile?.coverPic,
          },
        ]
      : [],
  };

  const propsUpload = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
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

  return (
    <Modal
      title="Basic Modal"
      open={isOpen}
      onCancel={handleCancel}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Form
        onFinish={onFinish}
        layout="vertical"
        name="basic"
        form={form}
        initialValues={initialValues}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: "Please input your city!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Website"
          name="website"
          rules={[{ required: true, message: "Please input your website!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="profilePic"
          label="Profile Picture"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          valuePropName="fileList"
        >
          <Upload
            {...propsUpload}
            customRequest={(options) => customUpload(options, "profilePic")}
            style={{ width: "100%" }}
            icon={<UploadOutlined />}
          >
            <Button>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="coverPic"
          label="Cover Picture"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          valuePropName="fileList"
        >
          <Upload
            {...propsUpload}
            style={{ width: "100%" }}
            icon={<UploadOutlined />}
            customRequest={(options) => customUpload(options, "coverPic")}
          >
            <Button>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProfile;
