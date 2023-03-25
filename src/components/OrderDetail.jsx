import { Descriptions, Table } from "antd";
import { Link } from "react-router-dom";
import { discountPrice } from "./ProductListColumn";

const OrderDetail = ({ orders, isFetching, action }) => {
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
    Table.EXPAND_COLUMN,
  ];
  // Set Columns for Order Product Detail
  const columns2 = [
    {
      title: "Name",
      dataIndex: "title",
      render: (text, record) => (
        <Link to={`/post/${record.postId}`}>{text}</Link>
      ),
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
    ...(action ? [action] : []),
  ];
  return (
    <Table
      columns={columns}
      dataSource={orders}
      pagination={false}
      bordered
      loading={isFetching}
      rowKey="order_id"
      style={{ width: "100%", marginTop: "2rem" }}
      expandable={{
        expandedRowRender: (Order) => (
          <>
            <Descriptions>
              <Descriptions.Item label="Customer Name">
                {Order.firstname} {Order.lastname}
              </Descriptions.Item>
              <Descriptions.Item label="Order Id">
                {Order.order_id}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {Order.phone}
              </Descriptions.Item>
              <Descriptions.Item label="City">{Order.city}</Descriptions.Item>
              <Descriptions.Item label="Country">
                {Order.country}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Address">
                {Order.address}
              </Descriptions.Item>
            </Descriptions>
            <Table
              columns={columns2}
              dataSource={Order.products}
              pagination={false}
              bordered
              rowKey="cart_id"
              style={{ width: "100%" }}
            />
          </>
        ),
      }}
    />
  );
};

export default OrderDetail;
