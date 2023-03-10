import { Avatar, Input } from "antd";
import "./nav.scss";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/darkModeContext";
import { useAuth } from "../../context/authContext";
const { Search } = Input;

const NavBar = () => {
  const { darkMode, toggle } = useDarkMode();
  const { currentUser } = useAuth();
  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">eatSocial</span>
        </Link>
        <i className="ri-home-4-line"></i>
        <i
          className={`ri-${darkMode ? "sun-line" : "moon-line"}`}
          onClick={toggle}
          style={{ cursor: "pointer" }}
        ></i>
        <i className="ri-menu-line"></i>
        <div className="search">
          <Search
            placeholder="input search text"
            allowClear
            className="searchInput"
          />
        </div>
      </div>
      <div className="right">
        <i className="ri-user-line"></i>
        <i className="ri-mail-unread-line"></i>
        <i className="ri-notification-3-line"></i>
        <div className="user">
          <Avatar
            src={
              currentUser.profilePic
                ? currentUser.profilePic
                : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${currentUser?.name}`
            }
          />
          <span>{currentUser?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
