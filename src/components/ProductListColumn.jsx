export const discountPrice = (price, discount) => {
  const discountPrice = discount ? price - (price * discount) / 100 : price;
  return Number(discountPrice).toFixed(2);
};

export const ProductListColumns = [
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
        {(discountPrice(record.price, record.discount) * record.qty).toFixed(2)}
      </span>
    ),
  },
];
