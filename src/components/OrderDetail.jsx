import { Descriptions, Modal, Table } from "antd";
import React from "react";
import { ProductListColumns, discountPrice } from "./ProductListColumn";

const OrderDetail = ({ isOpen, setIsOpen, Order }) => {
  const handleCancel = () => {
    setIsOpen(false);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text, record) => (
        <div>
          <span
            style={{
              textDecoration: record.discount ? "line-through" : "none",
            }}
          >
            ₹{text}
          </span>
          {record.discount ? (
            <span style={{ color: "green", marginLeft: "10px" }}>
              ₹{discountPrice(text, record.discount)} ( {record.discount}% off )
            </span>
          ) : null}
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "totalQ",
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (text, record) => (
        <span>
          {(
            discountPrice(record.price, record.discount) * record.totalQ
          ).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "approve_status",
      render: (text) => (
        <span>
          {text === 0 ? "Pending" : text === 1 ? "Approved" : "Rejected"}
        </span>
      ),
    },
  ];
  return (
    <Modal
      title="Order Detail"
      open={isOpen}
      onCancel={handleCancel}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      width={1000}
    >
      <Descriptions>
        <Descriptions.Item label="Customer Name">
          {Order.firstname} {Order.lastname}
        </Descriptions.Item>
        <Descriptions.Item label="Order Id">{Order.order_id}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {Order.phone}
        </Descriptions.Item>
        <Descriptions.Item label="City"> {Order.city}</Descriptions.Item>
        <Descriptions.Item label="Country"> {Order.country}</Descriptions.Item>
        <Descriptions.Item label="Shipping Address">
          {Order.address}
        </Descriptions.Item>
      </Descriptions>
      <Table
        columns={columns}
        dataSource={Order.products}
        pagination={false}
        bordered
        rowKey="cart_id"
        style={{ width: "100%" }}
      />
    </Modal>
  );
};

export default OrderDetail;
