import { Avatar, List, Modal } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const FModel = ({ isOpen, setIsOpen, Users , title}) => {
  const handleCancel = () => {
    setIsOpen(false);
  };
  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={handleCancel}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <List
        itemLayout="horizontal"
        dataSource={Users}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    item.profilePic
                      ? item.profilePic
                      : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${item.name}`
                  }
                />
              }
              title={<Link to={`/profile/${title == "Followers" ? item.followerUserId : item.followedUserId}`} onClick={handleCancel}>{item.name}</Link>}
              description={item.email}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default FModel;
