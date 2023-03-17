import React from "react";
import { useAuth } from "../../context/authContext";
import { getOrders } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";

const YourOrders = () => {
  const { currentUser } = useAuth();
  const { data: orders, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // Get Total Price
  const discountPrice = (price, discount) => {
    const discountPrice = discount ? price - (price * discount) / 100 : price;
    return Number(discountPrice).toFixed(2);
  };
  // Set Columns
  const columns = [
    {
      title: "Order Id",
      dataIndex: "order_id",
    },
    {
      title: "Order Date",
      dataIndex: 'createdAt',
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      render: (text) => <span>{text === "2" ? "Cash On Delivery" : "Online"}</span>,
    },
    {
      title: "Order Total",
      dataIndex: "order_total",
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={orders}
      pagination={false}
      bordered
      loading={isFetching}
      rowKey="order_id"
      style={{ width: "100%" }}
    />
  );
};

export default YourOrders;
