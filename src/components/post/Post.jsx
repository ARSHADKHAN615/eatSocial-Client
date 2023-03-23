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
import ProfileImg from "../ProfileImg";
import {
  EmailShareButton,
  EmailIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";
const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
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
            className="ri-delete-bin-2-line"
            style={{ fontSize: "1.2rem" }}
          ></i>
        </>
      ),
      key: "0",
    },
    {
      label: (
        <i className="ri-edit-box-line" style={{ fontSize: "1.2rem" }}></i>
      ),
      key: "1",
    },
  ];
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <Link to={`/profile/${post.userId}`}>
            <div className="userInfo">
              <ProfileImg user={post} />
              <div className="details">
                <span className="name">{post.name}</span>
                <span className="date">{format(post.createdAt)} </span>
              </div>
            </div>
          </Link>
          <div className="options">
            {currentUser.id === post.userId && (
              <Dropdown
                menu={{
                  items,
                  onClick: ({ key }) => {
                    if (key === "0") {
                      confirm();
                    } else if (key === "1") {
                      setIsPostModalOpen(true);
                    }
                  },
                }}
                trigger={["click"]}
                arrow
              >
                <i className="ri-more-fill" style={{ cursor: "pointer" }}></i>
              </Dropdown>
            )}
          </div>
        </div>
        <Link to={`/post/${post.id}`}>
          <div className="content">
            <p>{post?.title}</p>
            <img src={post.img} alt="" />
            <p>{post.desc}</p>
          </div>
        </Link>
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
            Comments
          </div>
          <div className="item">
            {/* <i className="ri-share-line"></i> */}

            <WhatsappShareButton
              url={window.location.origin + "/post/" + post.id}
              title={post.title}
              separator=":: "
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <TwitterShareButton
              url={window.location.origin + "/post/" + post.id}
              title={post.title}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton
              url={window.location.origin + "/post/" + post.id}
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
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
