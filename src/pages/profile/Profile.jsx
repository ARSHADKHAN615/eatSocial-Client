import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Posts from "../../components/posts/Posts";
import "./profile.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Button, Skeleton, Space, message } from "antd";
import {
  createComment,
  createConversationApi,
  followUser,
  getProfile,
  unfollowUser,
} from "../../api";
import { MessageOutlined } from "@ant-design/icons";
import demoCover from "../../assets/demoCover.svg";
import UpdateProfile from "../../components/formModel/UpdateProfile";
import { useState } from "react";
import LoadingCow from "../../components/LoadingCow";
import FModel from "../../components/FModel";

const Profile = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [followersListModal, setFollowersListModal] = useState(false);
  const [followingListModal, setFollowingListModal] = useState(false);
  const queryClient = useQueryClient();
  const [followersId, setFollowersId] = useState([]);
  const navigate = useNavigate();
  // Get UserProfile Information
  const {
    data: profile,
    isFetching,
    isLoading,
    status,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: getProfile,
    enabled: !!userId,
    onSuccess: (data) => {
      setFollowersId(data.followers.map((user) => user.followerUserId));
    },
    onError: (error) => {
      message.error(error.response?.data.error || error.message);
    },
  });

  // Handle User Follow and Unfollow
  const mutation = useMutation(
    (isFollowed) => {
      if (isFollowed) return unfollowUser(userId);
      else return followUser(userId);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("followers");
        message.success(data.message);
      },
      onError: (error) => {
        message.error(error.response.data.error || "Something went wrong");
      },
    }
  );
  const handleFollow = () => {
    mutation.mutate(followersId.includes(currentUser.id));
  };

  // Create Conversation
  const { mutate: handleConversation } = useMutation(
    (ids) => createConversationApi(ids),
    {
      onSuccess: (data) => {
        message.success(data.data.message);
        console.log(data.data);
        navigate(`/conversation`);
      },
      onError: (error) => {
        message.error(error.response.data.error || "Something went wrong");
      },
    }
  );

  const createConversation = () => {
    handleConversation({ senderId: currentUser.id, receiverId: userId });
  };

  return status === "error" ? (
    <h1>Something went wrong</h1>
  ) : (
    <div className="profile">
      <div className="images">
        <img
          src={profile?.coverPic ? profile.coverPic : demoCover}
          className="cover"
        />
        {isFetching ? (
          <div className="profilePic"></div>
        ) : (
          <img
            src={
              profile?.profilePic
                ? profile.profilePic
                : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${profile?.name}`
            }
            className="profilePic"
          />
        )}
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          {isLoading ? (
            <Skeleton active />
          ) : (
            <>
              <div className="center">
                <div className="name">
                  <span className="username">{profile?.username}</span>
                  <span className="name">{profile?.name}</span>
                </div>
                <div className="info">
                  {profile?.city && (
                    <div className="item">
                      <i className="ri-map-pin-line"></i>
                      <span>{profile?.city}</span>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="item">
                      <i className="ri-global-line"></i>
                      <span>{profile?.website}</span>
                    </div>
                  )}
                </div>
                {userId == currentUser.id ? (
                  <Button
                    type="primary"
                    onClick={() => setIsUpdateModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                ) : !followersId.includes(currentUser.id) ? (
                  <Button type="primary" onClick={handleFollow}>
                    Follow
                  </Button>
                ) : (
                  <Space direction="vertical">
                    <Space wrap>
                      <Button type="primary" onClick={handleFollow}>
                        Unfollow
                      </Button>
                      <Button
                        type="primary"
                        onClick={createConversation}
                        icon={<MessageOutlined />}
                      >
                        Message
                      </Button>
                    </Space>
                  </Space>
                )}
              </div>
              <div className="left">
                <Space direction="vertical">
                  <Space wrap>
                    <Button
                      type="primary"
                      onClick={() => setFollowersListModal(true)}
                    >
                      Followers: {profile?.followers?.length}
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => setFollowingListModal(true)}
                    >
                      Following: {profile?.followings?.length}
                    </Button>
                  </Space>
                </Space>
              </div>
            </>
          )}
        </div>
        {isLoading || isFetching ? <LoadingCow /> : <Posts userId={userId} />}
      </div>
      <UpdateProfile
        isOpen={isUpdateModalOpen}
        setIsOpen={setIsUpdateModalOpen}
        profile={profile}
      />
      <FModel
        isOpen={followersListModal}
        setIsOpen={setFollowersListModal}
        Users={profile?.followers}
        title="Followers"
      />
      <FModel
        isOpen={followingListModal}
        setIsOpen={setFollowingListModal}
        Users={profile?.followings}
        title="Following"
      />
    </div>
  );
};

export default Profile;
