import { productStatus, userGetOrders } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OrderDetail from "../../components/OrderDetail";
import { Button, message } from "antd";

const GetOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders, isFetching } = useQuery({
    queryKey: ["userGetOrders"],
    retry: 0,
    queryFn: userGetOrders,
  });

  const { mutate: productStatusHandler } = useMutation(
    (data) => productStatus(data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("userGetOrders");
        message.success(data.message);
      },
      onError: (error) => {
        message.error(error.response.data.error || "Something went wrong");
      },
    }
  );

  const ActionColumn = {
    title: "Action",
    dataIndex: "action",

    render: (text, record) => (
      <div>
        <Button
          onClick={() =>
            productStatusHandler({
              id: record.order_product_id,
              status: 1,
              order_id: record.order_id,
            })
          }
                type="primary"
        >
          Approve
        </Button>
        <Button
          danger
          onClick={() =>
            productStatusHandler({
              id: record.order_product_id,
              status: 2,
              order_id: record.order_id,
            })
          }
                 type="primary"
        >
          Reject
        </Button>
      </div>
    ),
  };
  return (
    <div className="your-orders">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Get Orders
      </h1>
      <OrderDetail
        orders={orders}
        isFetching={isFetching}
        action={ActionColumn}
      />
    </div>
  );
};

export default GetOrders;
