import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, removeFromCart } from "../../api";
import { Button, Popconfirm, Space, Table, message } from "antd";
import "./cart.scss";
import { Link } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import {
  ProductListColumns,
  discountPrice,
} from "../../components/ProductListColumn";
import React from "react";
const Cart = () => {
  const queryClient = useQueryClient();
  const [qtyError, setQtyError] = React.useState(false);

  // Get Cart
  const { cart, cartFetching: isFetching } = useCart();

  // Handle Delete Cart Item
  const removeFromCartMutation = useMutation(
    (cartId) => removeFromCart(cartId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cart");
        message.success("Item removed from cart successfully");
      },
      onError: (error) => {
        message.error(error.response.data.error || "Something went wrong");
      },
    }
  );

  const columns = [
    ...ProductListColumns,
    {
      title: "Action",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button type="primary">Edit</Button> */}
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => removeFromCartMutation.mutate(record.cart_id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },  
  ];
  return (
    <div className="cart">
      <Table
        columns={columns}
        dataSource={cart}
        pagination={false}
        bordered
        loading={isFetching}
        title={() => <h1>Cart</h1>}
        summary={(pageData) => {
          let grandTotal = 0;
          pageData.forEach(({ price, qty, discount, totalQ }) => {
            grandTotal += discountPrice(price, discount) * qty;
          });
          pageData.forEach(({ qty, totalQ }) => {
            if (qty > totalQ) {
              setQtyError(true);
              return;
            }
          });
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={1} colSpan={4}>
                  Grand Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{grandTotal}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
        rowKey="cart_id"
        style={{ width: "100%" }}
      />
      <div className="cart-actions">
        <Link to="/">
          <Button type="primary" size="large">
            Continue Shopping
          </Button>
        </Link>
        {cart.length > 0 && !qtyError ? (
          <Link to="/checkout">
            <Button type="primary" style={{ float: "right" }} size="large">
              Checkout
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default Cart;
