import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./post.scss";
import Comments from "../comments/Comments";
import { format } from "timeago.js";
import { deletePost, dislikePost, getLikes, likePost } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/authContext";
import { message } from "antd";
import AddToCard from "../AddToCard";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [deleteMenu, setDeleteMenu] = useState(false);

  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const postId = post?.id;

  // Get Post Likes
  const { data: likes, isFetching } = useQuery({
    queryKey: ["likes", postId],
    queryFn: getLikes,
    enabled: !!postId,
    onError: (error) => {
      message.error(error.response?.data.error || error.message);
    },
  });

  // Handle Delete Post
  const deletePostMutation = useMutation((postId) => deletePost(postId), {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      message.success("Post deleted successfully");
    },
    onError: (error) => {
      message.error(error.response.data.error || "Something went wrong");
    },
  });
  const handleDelete = (postId) => {
    deletePostMutation.mutate(postId);
  };

  // Handle Like and Dislike Post
  const mutation = useMutation(
    (isLiked) => {
      if (isLiked) return dislikePost(postId);
      else return likePost(postId);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("likes");
        message.success("Like updated successfully");
      },
      onError: (error) => {
        message.error(error.response.data.error || "Something went wrong");
      },
    }
  );
  const handleLike = () => {
    mutation.mutate(likes?.includes(currentUser.id));
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={
                post.profilePic
                  ? post.profilePic
                  : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${post?.name}`
              }
              alt=""
            />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{format(post.createdAt)} </span>
            </div>
          </div>
          <div className="options">
            {currentUser.id === post.userId && (
              <i
                className="ri-more-fill"
                style={{ cursor: "pointer" }}
                onClick={() => setDeleteMenu((prev) => !prev)}
              ></i>
            )}
            {deleteMenu && (
              <button className="delete" onClick={() => handleDelete(post.id)}>
                Delete
              </button>
            )}
          </div>
        </div>
        <div className="content">
          <p>{post?.title}</p>
          <img src={post.img} alt="" />
          <p>{post.desc}</p>
        </div>
        {post.is_for_sell == 1 && <AddToCard post={post} />}
        <div className="info">
          <div className="item">
            {isFetching ? (
              <i className="ri-loader-line"></i>
            ) : likes?.includes(currentUser.id) ? (
              <i
                className="ri-heart-fill"
                style={{ color: "red" }}
                onClick={handleLike}
              ></i>
            ) : (
              <i className="ri-heart-line" onClick={handleLike}></i>
            )}
            {likes?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <i className="ri-message-2-line"></i>
            12 Comments
          </div>
          <div className="item">
            <i className="ri-share-line"></i>
            Share
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
