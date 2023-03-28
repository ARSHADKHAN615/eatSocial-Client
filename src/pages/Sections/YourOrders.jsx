import { getOrders } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { Descriptions, Table } from "antd";
import { discountPrice } from "../../components/ProductListColumn";
import OrderDetail from "../../components/OrderDetail";

const YourOrders = () => {
  const { data: orders, isFetching } = useQuery({
    queryKey: ["orders"],
    retry: 0,
    queryFn: getOrders,
  });

  return (
    <div className="your-orders">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Your Orders</h1>
      <OrderDetail orders={orders} isFetching={isFetching} />
    </div>
  );
};

export default YourOrders;
