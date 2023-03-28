import { useMutation } from "@tanstack/react-query";
import "./style.scss";
import {
  Button,
  Card,
  Form,
  Input,
  Radio,
  Select,
  Slider,
  Space,
  message,
} from "antd";
const { Meta } = Card;
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  LikeOutlined,
} from "@ant-design/icons";

import { getFilterPosts } from "../../api";
import { Link } from "react-router-dom";
import NormalLoader from "../../components/NormalLoader";
import FormatPrice from "../../components/FormatPrice";

export const LikesCount = ({ data }) => {
  return (
    <div className="post-card-info">
      <div className="likesCount">
        <LikeOutlined key="like" />
        <span>{data.totalLikes}</span>
      </div>
      {data.price && (
        <div className="price">
          <span>
            <FormatPrice price={data.price} />
          </span>
        </div>
      )}
    </div>
  );
};

const Explore = () => {
  const marks = {
    0: "₹ 0",
    1000: "₹ 1000",
  };

  // Handle Filter Posts
  const {
    mutate: filterPosts,
    isLoading,
    data: filterData,
  } = useMutation((url) => getFilterPosts(url), {
    onSuccess: (data) => {},
    onError: (error) => {
      message.error(error.response.data.error || "Something went wrong");
    },
  });
  const onFinish = (values) => {
    const { search, price, orderOfPopularity, orderOfNewest, limit, sellable } =
      values;
    // make URL
    let url = `posts/filter?`;
    if (search) {
      url += `search=${search}&`;
    }
    if (sellable) {
      url += `sellable=${sellable}&`;
    }
    if (price) {
      url += `price=${price[0]}-${price[1]}&`;
    }
    if (orderOfPopularity) {
      url += `orderOfPopularity=${orderOfPopularity}&`;
    }
    if (orderOfNewest) {
      url += `orderOfNewest=${orderOfNewest}&`;
    }
    if (limit) {
      url += `limit=${limit}`;
    }
    filterPosts(url);
  };

  const initialValues = {
    search: "",
    price: [0, 100],
    orderOfPopularity: "1",
    // orderOfNewest: "1",
    sellable: false,
    limit: "5",
  };

  return (
    <div className="explore">
      <div className="filter-Form">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Explore What You Want
        </h1>
        <Form
          className="filter-form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Form.Item label="Search" name="search" style={{ width: "45%" }}>
              <Input placeholder="Search Name or Description" />
            </Form.Item>
            <Form.Item label="Sort" name="sellable" style={{ width: "45%" }}>
              <Radio.Group size="large">
                <Radio value={false}>All</Radio>
                <Radio value={true}>Only Sellable</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.sellable !== currentValues.sellable
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("sellable") ? (
                <>
                  <Form.Item label="Price Range" name="price">
                    <Slider
                      range
                      marks={marks}
                      tooltip={{ formatter: (value) => `₹ ${value}` }}
                      min={0}
                      max={1000}
                    />
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>

          <Space.Compact block direction="horizontal" style={{ width: "100%" }}>
            <Form.Item name="orderOfPopularity" style={{ width: "35%" }}>
              <Select placeholder="Select On Popularity">
                <Select.Option value="1">Most Popular</Select.Option>
                <Select.Option value="0">Less Popularity</Select.Option>
              </Select>
            </Form.Item>
            {/* <Form.Item name="orderOfNewest" style={{ width: "25%" }}>
              <Select placeholder="Select On Newest">
                <Select.Option value="1">Latest</Select.Option>
                <Select.Option value="0">Old</Select.Option>
              </Select>
            </Form.Item> */}
            <Form.Item name="limit" style={{ width: "30%" }}>
              <Select placeholder="Select Limit">
                <Select.Option value="5">5</Select.Option>
                <Select.Option value="10">10</Select.Option>
                <Select.Option value="15">15</Select.Option>
                <Select.Option value="20">20</Select.Option>
                <Select.Option value="25">25</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ width: "15%" }}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Space.Compact>
        </Form>
      </div>
      <div className="search-list">
        {isLoading && <NormalLoader />}
        {filterData?.map((item) => (
          <Link to={`/post/${item.id}`} key={item.id} className="cards">
            <Card
              hoverable
              style={{
                width: "100%",
                margin: "10px",
              }}
              cover={<img alt="example" src={item.img} />}
            >
              <Meta
                title={item.title}
                description={item.desc.slice(0, 50) + "..."}
              />
              <LikesCount data={item} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Explore;
