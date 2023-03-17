import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./post.scss";
import Comments from "../comments/Comments";
import { format } from "timeago.js";
import { deletePost, dislikePost, getLikes, likePost } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/authContext";
import { Dropdown, Modal, message } from "antd";
import AddToCard from "../AddToCard";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import HandlePost from "../formModel/HandlePost";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const postId = post?.id;


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
    mutation.mutate(post?.likes?.includes(currentUser.id));
  };

  const confirm = () => {
    modal.confirm({
      title: "Are you sure delete this post?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      cancelText: "No",
      okButtonProps: {
        danger: true,
      },
      onOk() {
        handleDelete(postId);
      },
    });
  };

  const items = [
    {
      label: (
        <>
          <i
            onClick={confirm}
            className="ri-delete-bin-2-line"
            style={{ fontSize: "1.2rem" }}
          ></i>
        </>
      ),
      key: "0",
    },
    {
      label: <i className="ri-edit-box-line" onClick={() => setIsPostModalOpen(true)} style={{ fontSize: "1.2rem" }}></i>,
      key: "1",
    },
  ];
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
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
                arrow
              >
                <i className="ri-more-fill" style={{ cursor: "pointer" }}></i>
              </Dropdown>
              // <i
              //   className="ri-more-fill"
              //   style={{ cursor: "pointer" }}
              //   onClick={() => setDeleteMenu((prev) => !prev)}
              // ></i>
            )}
            {/* {deleteMenu && (
              <button className="delete" onClick={() => handleDelete(post.id)}>
                Delete
              </button>
            )} */}
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
            {post?.likes?.includes(currentUser.id) ? (
              <i
                className="ri-heart-fill"
                style={{ color: "red" }}
                onClick={handleLike}
              ></i>
            ) : (
              <i className="ri-heart-line" onClick={handleLike}></i>
            )}
            {post?.likes?.length} Likes
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
      {contextHolder}
      <HandlePost
        isOpen={isPostModalOpen}
        setIsOpen={setIsPostModalOpen}
        post={post}
      />
    </div>
  );
};

export default Post;
