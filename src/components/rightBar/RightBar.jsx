import { useQuery } from "@tanstack/react-query";
import { getUsersWhichHaveMostFollowers } from "../../api";
import "./right.scss";
import { Link } from "react-router-dom";
import ProfileImg from "../ProfileImg";
import NormalLoader from "../NormalLoader";

const RightBar = () => {
  const {
    data: users,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["MostFollowers"],
    retry: 1,
    queryFn: getUsersWhichHaveMostFollowers,
    onError: (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      console.log(error.response?.data.error || error.message);
    },
  });

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>
            Most Influential
            <br />
          </span>
          {isLoading ? (
            <NormalLoader />
          ) : (
            users?.map((user) => (
              <Link
                to={`/profile/${user.userId}`}
                className="link"
                key={user.userId}
              >
                <div className="user">
                  <div className="userInfo">
                    <ProfileImg user={user} />
                    <span> {user.name} </span>
                  </div>
                  {/* <div className="buttons">
                <button>follow</button>
                <button>dismiss</button>
              </div> */}
                </div>
              </Link>
            ))
          )}
        </div>
        {/* <div className="item">
        <span>Latest Activities</span>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <p>
              <span>Jane Doe</span> changed their cover picture
            </p>
          </div>
          <span>1 min ago</span>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <p>
              <span>Jane Doe</span> changed their cover picture
            </p>
          </div>
          <span>1 min ago</span>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <p>
              <span>Jane Doe</span> changed their cover picture
            </p>
          </div>
          <span>1 min ago</span>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <p>
              <span>Jane Doe</span> changed their cover picture
            </p>
          </div>
          <span>1 min ago</span>
        </div>
      </div>
      <div className="item">
        <span>Online Friends</span>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default RightBar;
