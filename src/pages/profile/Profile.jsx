import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Posts from "../../components/posts/Posts";
import "./profile.scss";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Skeleton, message } from "antd";
import { followUser, getProfile, unfollowUser } from "../../api";
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

  // Get UserProfile Information
  const { data: profile, isFetching } = useQuery({
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

  return (
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
          {isFetching ? (
            <Skeleton active />
          ) : (
            <>
              <div className="center">
                <span>{profile?.name}</span>
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
                  <button
                    className="edit"
                    onClick={() => setIsUpdateModalOpen(true)}
                  >
                    Edit Profile
                  </button>
                ) : !followersId.includes(currentUser.id) ? (
                  <button className="follow" onClick={handleFollow}>
                    Follow
                  </button>
                ) : (
                  <button className="unfollow" onClick={handleFollow}>
                    Unfollow
                  </button>
                )}
              </div>
              <div className="left">
                <span onClick={() => setFollowersListModal(true)}>
                  Followers: <b>{profile?.followers?.length}</b>
                </span>
                <span onClick={() => setFollowingListModal(true)}>
                  Following: <b>{profile?.followings?.length}</b>
                </span>
              </div>
            </>
          )}
        </div>
        {isFetching ? <LoadingCow /> : <Posts userId={userId} />}
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
