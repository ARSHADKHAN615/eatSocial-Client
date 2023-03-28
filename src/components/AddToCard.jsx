import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, InputNumber, message } from "antd";
import React from "react";
import { addToCart } from "../api";
import { useAuth } from "../context/authContext";
import FormatPrice from "./FormatPrice";
import { discountPrice } from "./ProductListColumn";

const AddToCard = ({ post }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  // Handle Add to Cart
  const { mutate, isLoading } = useMutation((item) => addToCart(item), {
    onSuccess: () => {
      message.success("Item added to cart successfully");
      queryClient.invalidateQueries("cart_count", { refetchActive: false });
    },
    onError: (error) => {
      message.error(error.response.data.error || "Something went wrong");
    },
  });
  const initialValues = {
    qty: 1,
  };
  return (
    <div className="buy-info">
      <div className="price">
        <div>
          <span
            style={{
              textDecoration: post.discount ? "line-through" : "none",
            }}
          >
            <FormatPrice price={post.price} />
          </span>
          <br />
          {post.discount ? (
            <span style={{ color: "green"}}>
              <FormatPrice price={discountPrice(post.price, post.discount)} /> ({" "}
              {post.discount}% off )
            </span>
          ) : null}
        </div>
      </div>
      {post.qty > 0 ? (
        <Form
          layout="inline"
          form={form}
          onFinish={(values) => mutate({ ...values, postId: post.id })}
          initialValues={initialValues}
        >
          <Form.Item
            label="Quantity"
            name="qty"
            rules={[{ required: true, message: "Quantity is required!" }]}
          >
            <InputNumber min={1} max={post.qty} style={{ width: "100%" }} />
          </Form.Item>
          {currentUser.id != post.userId && (
            <Form.Item style={{ textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="buy"
              >
                Add to Cart
              </Button>
            </Form.Item>
          )}
        </Form>
      ) : (
        <div className="qty">Out of Stock</div>
      )}
    </div>
  );
};

export default AddToCard;
