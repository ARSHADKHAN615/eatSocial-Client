import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { getOrders } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import OrderDetail from "../../components/OrderDetail";

const YourOrders = () => {
  const { currentUser } = useAuth();
  const [orderDetailModal, setOrderDetailModal] = useState(false);
  const { data: orders, isFetching } = useQuery({
    queryKey: ["orders"],
    retry: 0,
    queryFn: getOrders,
  });

  // Set Columns
  const columns = [
    {
      title: "Order Id",
      dataIndex: "order_id",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      render: (text) => (
        <span>{text === "2" ? "Cash On Delivery" : "Online"}</span>
      ),
    },
    {
      title: "Order Total",
      dataIndex: "order_total",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <span onClick={() => setOrderDetailModal(true)} className="view-order">
            <i class="ri-eye-line"></i>
          </span>
          <OrderDetail
            isOpen={orderDetailModal}
            setIsOpen={setOrderDetailModal}
            Order={record}
          />
        </>
      ),
    },
  ];
  return (
    <div className="your-orders">
      <Table
        columns={columns}
        dataSource={orders}
        pagination={false}
        bordered
        loading={isFetching}
        rowKey="order_id"
        style={{ width: "100%", marginTop: "2rem" }}
      />
    </div>
  );
};

export default YourOrders;
