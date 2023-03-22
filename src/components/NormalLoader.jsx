import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

const NormalLoader = () => {
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  return <Spin indicator={antIcon} />;
};

export default NormalLoader;
