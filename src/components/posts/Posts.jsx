import { useQuery } from "@tanstack/react-query";
import Post from "../post/Post";
import "./posts.scss";
import { getPosts } from "../../api";
import { message } from "antd";
import { useAuth } from "../../context/authContext";
import LoadingCow from "../LoadingCow";

const Posts = ({ userId }) => {
  const { logout } = useAuth();
  const {
    data: posts,
    error,
    status,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["posts"],
    retry: 1,
    queryFn: () => getPosts(userId),
    onError: (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      message.error(error.response?.data.error || error.message);
    },
  });

  return isLoading ? (
    <LoadingCow />
  ) : status === "error" ? (
    <span>Error: {error.response?.data.error || error.message}</span>
  ) : (
    <>
      <div className="posts">
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </>
  );
};

export default Posts;
