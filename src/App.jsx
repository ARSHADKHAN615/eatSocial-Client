import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import "./style.scss";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import NavBar from "./components/navBar/NavBar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/Home/Home";
import Profile from "./pages/profile/Profile";
import { ConfigProvider, theme } from "antd";
import { useDarkMode } from "./context/darkModeContext";
import { useAuth } from "./context/authContext";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/Checkout/OrderSuccess";
import YourOrders from "./pages/Sections/YourOrders";
import SearchUser from "./pages/Sections/SearchUser";
import emptyBox from "./lottieAnimation/empty-box.json";
import Lottie from "lottie-react";
import Message from "./pages/Messaging/Message";
import Explore from "./pages/Sections/Explore";
import PostDetail from "./pages/Sections/PostDetail";
import GetOrders from "./pages/Sections/GetOrders";
function App() {
  const { darkMode } = useDarkMode();
  const { currentUser } = useAuth();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  const customizeRenderEmpty = () => (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <Lottie animationData={emptyBox} loop={true} style={{ height: 250 }} />
    </div>
  );

  const Layout = () => {
    return (
      <div className={`body-bg  theme-${darkMode ? "dark" : "light"}`}>
        <NavBar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    );
  };

  const Layout2 = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <NavBar />
        <div style={{ display: "flex" }}>
          <Outlet />
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };
  const NoProtectedRoute = ({ children }) => {
    return !currentUser ? children : <Navigate to="/" />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile/:userId", element: <Profile /> },
        { path: "/your-orders", element: <YourOrders /> },
        { path: "/search", element: <SearchUser /> },
        { path: "/explore", element: <Explore /> },
        { path: "/post/:postId", element: <PostDetail /> },
        { path: "/get-orders", element: <GetOrders />}
      ],
    },
    {
      path: "/login",
      element: (
        <NoProtectedRoute>
          <SignIn />
        </NoProtectedRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <NoProtectedRoute>
          <SignUp />
        </NoProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout2 />
        </ProtectedRoute>
      ),
      children: [
        { path: "/cart", element: <Cart /> },
        { path: "/checkout", element: <Checkout /> },
        { path: "/order-success/:orderId", element: <OrderSuccess /> },
        { path: "/conversation", element: <Message /> },
      ],
    },
  ]);

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        }}
        renderEmpty={customizeRenderEmpty}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </div>
  );
}

export default App;
