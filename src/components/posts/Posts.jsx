import { useQuery } from "@tanstack/react-query";
import Post from "../post/Post";
import "./posts.scss";
import { getPosts } from "../../api";
import { message } from "antd";

const Posts = ({ userId }) => {
  const {
    data: posts,
    error,
    status,
    isFetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(userId),
    onError: (error) => {
      message.error(error.response?.data.error || error.message);
    },
  });
  return status === "loading" ? (
    <span>Loading...</span>
  ) : status === "error" ? (
    <span>Error: {error.response?.data.error || error.message}</span>
  ) : (
    <>
      {isFetching ? <div>Refreshing...</div> : null}
      <div className="posts">
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </>
  );
};

export default Posts;
