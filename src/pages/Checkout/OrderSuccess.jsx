import "./checkout.scss";
import Lottie from "lottie-react";
import cow from "../../lottieAnimation/placed-success.json";
import { Link, useParams } from "react-router-dom";
import { Button } from "antd";
const OrderSuccess = () => {
  const { orderId } = useParams();
  return (
    <div className="order-success">
      <h1>Order Success</h1>
      <Lottie animationData={cow} loop={true} style={{ height: 200 }} />
      <p>Thank you for your order</p>
      <p>please check your email for order Invoice And </p>
      <p>
        Your Order Id is: <b>{orderId}</b>
      </p>
      <Link to="/">
        <Button type="primary" size="large" style={{ marginTop: "20px" }}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default OrderSuccess;
