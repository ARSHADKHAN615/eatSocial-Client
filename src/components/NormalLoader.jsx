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
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Spin indicator={antIcon} />
    </div>
  );
};

export default NormalLoader;
