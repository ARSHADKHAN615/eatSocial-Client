import { Collapse, Form, Input, Radio, Space, Table } from "antd";
const { Panel } = Collapse;
import "./checkout.scss";

const Checkout = () => {
  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <Form layout="vertical">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="Shipping Address" key="1">
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Space
                direction="vertical"
                style={{ width: "100%", marginRight: "20px" }}
              >
                <h2>Your Personal Details</h2>
                <Form.Item label="First Name">
                  <Input />
                </Form.Item>
                <Form.Item label="Last Name">
                  <Input />
                </Form.Item>
                <Form.Item label="Address">
                  <Input />
                </Form.Item>
                <Form.Item label="Email">
                  <Input />
                </Form.Item>
                <Form.Item label="Phone">
                  <Input />
                </Form.Item>
              </Space>
              <Space direction="vertical" style={{ width: "100%" }}>
                <h2>Your Address</h2>
                <Form.Item label="City">
                  <Input />
                </Form.Item>
                <Form.Item label="State">
                  <Input />
                </Form.Item>
                <Form.Item label="Zip Code">
                  <Input />
                </Form.Item>
                <Form.Item label="Country">
                  <Input />
                </Form.Item>
              </Space>
            </div>
          </Panel>
          <Panel header="Payment Method" key="2">
            <h2>Select Payment Method</h2>
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="1">Paypal</Radio>
                <Radio value="2">Stripe</Radio>
                <Radio value="3">Cash on Delivery</Radio>
              </Space>
            </Radio.Group>
          </Panel>
          <Panel header="Order Summary" key="3">
            <Table></Table>
          </Panel>
        </Collapse>
      </Form>
    </div>
  );
};

export default Checkout;
