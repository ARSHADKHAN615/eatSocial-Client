import "./left.scss";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";
import { logoutApi } from "../../api";
import { useState } from "react";
const LeftBar = () => {
  const { currentUser, logout } = useAuth();
  const [menuActive, setMenuActive] = useState(false);
  const logoutHandler = async () => {
    try {
      await logoutApi();
      logout();
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`leftBar ${menuActive && "active"}`}>
      <div className="container">
        <div className="menu">
          <Link to={`/profile/${currentUser?.id}`}>
            <div className="item">
              <i className="ri-user-line"></i>
              <span>{currentUser?.name}</span>
            </div>
          </Link>
          <Link to="/search">
            <div className="item">
              <i className="ri-search-2-line"></i>
              <span>Search</span>
            </div>
          </Link>
          <Link to="/explore">
            <div className="item">
              <i className="ri-compass-3-line"></i>
              <span>Explore</span>
            </div>
          </Link>
          <Link to="/your-orders">
            <div className="item">
              <i className="ri-shopping-basket-line"></i>
              <span>Your Orders</span>
            </div>
          </Link>
          <Link to="/get-orders">
            <div className="item">
            <i className="ri-store-2-line"></i>
              <span> Get Orders</span>
            </div>
          </Link>
          <Link to="/conversation">
            <div className="item">
              <i className="ri-wechat-line"></i>
              <span>Conversation</span>
            </div>
          </Link>
        </div>
        <hr />
        <div className="menu">
          <div className="item" onClick={logoutHandler}>
            <i className="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
