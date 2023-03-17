import {
  Avatar,
  Input,
  List,
  Spin,
  message,
} from "antd";
const { Search } = Input;
import React from "react";
import { getUsers } from "../../api";
import { useQuery } from "@tanstack/react-query";
import "./style.scss";
import { Link } from "react-router-dom";

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: users, isFetching } = useQuery({
    queryKey: ["searchUser", searchQuery],
    queryFn: getUsers,
    enabled: !!searchQuery,
    onError: (error) => {
      message.error(error.response?.data.error || error.message);
    },
  });

  return (
    <div className="search-user">
      <Search
        placeholder="Search User"
        onChange={(e) => setSearchQuery(e.target.value)}
        loading={isFetching}
      />
      <div className="user-list">
        <Spin spinning={isFetching}>
          <List
            itemLayout="horizontal"
            dataSource={users}
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
                  title={<Link to={`/profile/${item.id}`}>{item.name}</Link>}
                  description={item.email}
                />
              </List.Item>
            )}
          />
        </Spin>
      </div>
    </div>
  );
};

export default SearchUser;
