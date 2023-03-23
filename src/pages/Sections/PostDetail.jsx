import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../../api";
import Post from "../../components/post/Post";
import { message } from "antd";
import "./style.scss";
import NormalLoader from "../../components/NormalLoader";
const PostDetail = () => {
  const { postId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: (postId) => getPost(postId),
    enabled: !!postId,
    onError: (error) => {
      message.error(error.response?.data.error || error.message);
    },
  });

  if (error) return <div>Something went wrong</div>;
  return (
    <div className="postDetail">
      {isLoading ? (
        <NormalLoader />
      ) : error ? (
        <div>Something went wrong</div>
      ) : (
        <Post post={data} />
      )}
    </div>
  );
};

export default PostDetail;
