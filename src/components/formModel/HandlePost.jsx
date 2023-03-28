import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Upload,
  message,
} from "antd";
const { TextArea } = Input;
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/authContext";
import { useFirebase } from "../../context/FirebaseContext";
import { createPost, updatePost } from "../../api";

const HandlePost = ({ isOpen, setIsOpen, post }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { setCurrentUser } = useAuth();
  const { customUpload } = useFirebase();

  // Handle Modal Close
  const handleCancel = () => {
    setIsOpen(false);
  };
  // Handle Post Create/Update
  const mutation = useMutation((newPost) => post ? updatePost(newPost) : createPost(newPost), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("posts");
      if (post) {
        message.success("Post updated successfully");
      } else {
        message.success("Post created successfully");
        form.resetFields();
      }
      handleCancel();
    },
    onError: (error) => {
      message.error(error.response.data.error || "Something went wrong");
    },
  });
  const onFinish = (values) => {
    mutation.mutate(post ? { ...values, id: post.id } : values);
    // console.log("Success:", values);
  };

  const propsUpload = {
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


  const initialValues = {
    isForSale: post?.is_for_sell == 1 ? true : false,
    title: post?.title,
    desc: post?.desc,
    price: post?.price,
    qty: post?.qty,
    discount: post?.discount,
    img: post?.img
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: post?.img,
          },
        ]
      : [],
  };
  return (
    <Modal
      title={post ? "Update Post" : "Create Post"}
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
        <Form.Item name="isForSale" style={{ textAlign: "center" }}>
          <Radio.Group optionType="button" buttonStyle="solid" size="large">
            <Radio value={false}>For Not Sale</Radio>
            <Radio value={true}>For Sale</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="desc"
          rules={[{ required: true, message: "Description is required!" }]}
        >
          <TextArea showCount maxLength={1000}  rows={4} />
        </Form.Item>
        <Form.Item
          name="img"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          valuePropName="fileList"
          style={{ width: "100%", marginBottom: "1rem" }}
          rules={[{ required: true, message: "Image is required!" }]}
        >
          <Upload
            {...propsUpload}
            style={{ width: "100%" }}
            customRequest={(options) => customUpload(options, "posts")}
            icon={<UploadOutlined />}
          >
            <Button>Upload Image</Button>
          </Upload>
        </Form.Item>
        {/* For Sell Felid */}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.isForSale !== currentValues.isForSale
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("isForSale") ? (
              <>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: "Price is required!" }]}
                >
                  <InputNumber
                    formatter={(value) =>
                      `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                    min={1}
                  />
                </Form.Item>
                <Form.Item
                  label="Quantity"
                  name="qty"
                  rules={[{ required: true, message: "Quantity is required!" }]}
                >
                  <InputNumber min={1}  style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  label="Discount"
                  name="discount"
                  rules={[{ required: true, message: "Discount is required!" }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value.replace("%", "")}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </>
            ) : null
          }
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" size="large">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HandlePost;
