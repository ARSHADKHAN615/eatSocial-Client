import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Posts from "../../components/posts/Posts";
import "./profile.scss";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { message } from "antd";
import {
  followUser,
  getFollowers,
  getFollowing,
  getProfile,
  unfollowUser,
} from "../../api";
import demoCover from "../../assets/demoCover.svg";
import UpdateProfile from "../../components/formModel/UpdateProfile";
import { useState } from "react";

const Profile = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get UserProfile Information
  const { data: profile, isFetching } = useQuery({
    queryKey: ["profile", userId],
    queryFn: getProfile,
    enabled: !!userId,
    onError: (error) => {
      message.error(error.response?.data.error || error.message);
    },
  });

  // Get Followers Users
  const { data: followers, isFetching: isFetchingFollowers } = useQuery({
    queryKey: ["followers", userId],
    queryFn: getFollowers,
    enabled: !!userId,
    onError: (error) => {
      message.error(error.response?.data.error || error.message);
    },
  });
  // Get Following Users
  const { data: followed, isFetching: isFetchingFollowed } = useQuery({
    queryKey: ["followed", userId],
    queryFn: getFollowing,
    enabled: !!userId,
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
    mutation.mutate(followers?.includes(currentUser.id));
  };

  return (
    <div className="profile">
      <div className="images">
        <img
          src={profile?.coverPic ? profile.coverPic : demoCover}
          className="cover"
        />
        <img
          src={
            profile?.profilePic
              ? profile.profilePic
              : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${profile?.name}`
          }
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <span>
              Followers: <b>{followers?.length}</b>
            </span>
            <span>
              Following: <b>{followed?.length}</b>
            </span>
          </div>
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
            ) : !followers?.includes(currentUser.id) ? (
              <button className="follow" onClick={handleFollow}>
                Follow
              </button>
            ) : followers?.includes(currentUser.id) ? (
              <button className="unfollow" onClick={handleFollow}>
                Unfollow
              </button>
            ) : null}
          </div>
          <div className="right">
            <i className="ri-mail-line"></i>
            <i className="ri-more-2-fill"></i>
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      <UpdateProfile
        isOpen={isUpdateModalOpen}
        setIsOpen={setIsUpdateModalOpen}
        profile={profile}
      />
    </div>
  );
};

export default Profile;
