import { Link } from "react-router-dom";
import FormatPrice from "./FormatPrice";

export const discountPrice = (price, discount) => {
  const discountPrice = discount ? price - (price * discount) / 100 : price;
  return Number(discountPrice).toFixed(2);
};

export const ProductListColumns = [
  {
    title: "Name",
    dataIndex: "title",
    render: (text, record) => (
      <Link to={`/post/${record.postId}`}>
        <span>{text}</span>
        <br />
        <span style={{ color: "gray" }}>{record.desc.slice(0, 50)}...</span>
      </Link>
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
          <FormatPrice price={text} />
        </span>
        {record.discount ? (
          <span style={{ color: "green", marginLeft: "10px" }}>
            <FormatPrice price={discountPrice(text, record.discount)} /> ({" "}
            {record.discount}% off )
          </span>
        ) : null}
      </div>
    ),
  },
  {
    title: "Quantity",
    dataIndex: "qty",
  },
  {
    title: "In Stock",
    render: (_, record) => (
      <div>
        <span>
          {record.qty <= record.totalQ ? (
            "Yes"
          ) : (
            <span style={{ color: "red" }}>
              <b>Not Available</b>
            </span>
          )}
        </span>
        <br />
        <span> Only {record.totalQ} left</span>
      </div>
    ),
  },
  {
    title: "Total",
    dataIndex: "total",
    render: (text, record) => (
      <span>
        <FormatPrice
          price={discountPrice(record.price, record.discount) * record.qty}
        />
      </span>
    ),
  },
];
