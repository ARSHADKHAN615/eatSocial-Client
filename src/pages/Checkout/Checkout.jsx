import {
  Alert,
  Button,
  Collapse,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Table,
  message,
} from "antd";
const { Panel } = Collapse;
const { TextArea } = Input;
import "./checkout.scss";
import { useCart } from "../../context/cartContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { placeOrder } from "../../api";
import { Country, State } from "country-state-city";
import {
  ProductListColumns,
  discountPrice,
} from "../../components/ProductListColumn";
import React from "react";

const Checkout = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { cart, cartFetching: isFetching } = useCart();
  const [qtyError, setQtyError] = React.useState(false);
  const navigate = useNavigate();

  // Place Order
  const { mutate: placeOrderBtn } = useMutation((data) => placeOrder(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("cart");
      navigate("/order-success");
      message.success("Order placed successfully");
    },
    onError: (error) => {
      message.error(error.response.data.error || "Something went wrong");
    },
  });

  const initialValues = {
    country: "IN",
  };
  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <Form
        layout="vertical"
        style={{ width: "100%", marginTop: "20px" }}
        form={form}
        initialValues={initialValues}
        onFinish={(values) => placeOrderBtn({ ...values, cart })}
      >
        <Collapse defaultActiveKey={["1"]} forceRender>
          <Panel header="Shipping Address" key="1">
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Space
                direction="vertical"
                style={{ width: "100%", marginRight: "20px" }}
              >
                <h2>Your Personal Details</h2>
                <Form.Item
                  label="First Name"
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Last Name"
                  name="lastname"
                  rules={[
                    { required: true, message: "Please input your last name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Space>
              <Space direction="vertical" style={{ width: "100%" }}>
                <h2>Your Address</h2>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[
                    { required: true, message: "Please input your address!" },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[
                    { required: true, message: "Please input your city!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Zip Code"
                  name="zipcode"
                  rules={[
                    { required: true, message: "Please input your zip code!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Country"
                  name="country"
                  rules={[
                    { required: true, message: "Please select a country!" },
                  ]}
                >
                  <Select
                    options={Country.getAllCountries()?.map((country) => ({
                      value: country.isoCode,
                      label: country.name,
                    }))}
                    onChange={(value) => form.setFieldsValue({ state: "" })}
                    showSearch
                  />
                </Form.Item>
                <Form.Item
                  dependency={["country"]}
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.country !== currentValues.country
                  }
                >
                  {({ getFieldValue }) => {
                    return (
                      <Form.Item
                        label="State"
                        name="state"
                        rules={[
                          { required: true, message: "Please select a state!" },
                        ]}
                      >
                        <Select
                          options={State.getStatesOfCountry(
                            getFieldValue("country")
                          )?.map((state) => ({
                            value: state.isoCode,
                            label: state.name,
                          }))}
                          showSearch
                          disabled={!getFieldValue("country")}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Space>
            </div>
          </Panel>
          <Panel header="Payment Method" key="2" forceRender={true}>
            <h2 style={{ marginBottom: "20px" }}>Select Payment Method</h2>
            <Form.Item
              label="Payment Method"
              name="payment_method"
              rules={[
                { required: true, message: "Please select a payment method!" },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="1">Online Payment</Radio>
                  <Radio value="2">Cash on Delivery</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Panel>
          <Panel header="Order Summary" key="3">
            <Table
              columns={ProductListColumns}
              dataSource={cart}
              pagination={false}
              bordered
              loading={isFetching}
              summary={(pageData) => {
                let grandTotal = 0;
                pageData.forEach(({ price, qty, discount }) => {
                  grandTotal += discountPrice(price, discount) * qty;
                });
                pageData.forEach(({ qty, totalQ }) => {
                  if (qty > totalQ) {
                    setQtyError(true);
                    return;
                  }
                });
                return (
                  <>
                    <Table.Summary.Row style={{ fontWeight: "bold" }}>
                      <Table.Summary.Cell index={1} colSpan={4}>
                        <Form.Item
                          name="total"
                          hidden
                          initialValue={grandTotal}
                        >
                          <Input />
                        </Form.Item>
                        Grand Total
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        {grandTotal}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
              rowKey="cart_id"
              style={{ width: "100%" }}
            />
            {qtyError ? (
              <Alert
                message="Some products are out of stock OR you have exceeded the quantity limit"
                type="error"
                showIcon
                style={{ marginTop: "20px" }}
              />
            ) : cart.length === 0 ? (
              <Alert
                message="Your cart is empty"
                type="error"
                showIcon
                style={{ marginTop: "20px" }}
              />
            ) : (
              <Form.Item style={{ marginTop: "20px", textAlign: "right" }}>
                <Button type="primary" htmlType="submit" size="large">
                  Place Order
                </Button>
              </Form.Item>
            )}
          </Panel>
        </Collapse>
      </Form>
    </div>
  );
};

export default Checkout;
