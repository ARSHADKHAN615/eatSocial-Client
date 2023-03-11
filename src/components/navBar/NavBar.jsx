import { Avatar, Input } from "antd";
import "./nav.scss";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/darkModeContext";
import { useAuth } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../../api";
const { Search } = Input;

const NavBar = () => {
  const { darkMode, toggle } = useDarkMode();
  const { currentUser } = useAuth();

  // Get Cart Count
  const { data: cartCount, isFetching } = useQuery({
    queryKey: ["cart_count"],
    queryFn: getCart,
    onError: (error) => {
      message.error(error.response?.data.error || error.message);
    },
  });

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
        <Link to="/cart" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="cart__icon">
            <i className="ri-shopping-cart-2-line"></i>
            <span className="cart__count">{cartCount?.length}</span>
          </div>
        </Link>
        <div className="user">
          <Link
            to={`/profile/${currentUser?.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Avatar
              src={
                currentUser.profilePic
                  ? currentUser.profilePic
                  : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${currentUser?.name}`
              }
            />
            <span>{currentUser?.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
