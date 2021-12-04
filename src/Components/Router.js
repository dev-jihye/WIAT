import { Routes, Route, Navigate } from "react-router-dom";
import Home from "Components/Screens/Home";
import Auth from "./Screens/Auth";
import Error404 from "./Screens/Error404";
import { ROUTE } from "constance";
import { loggedInUserVar } from "apollo";
import Blog from "./Screens/Blog";
import CreatePost from "./Screens/CreatePost";
import EditPost from "./Screens/EditPost";

const AppRouter = () => {
  const loggedInUser = loggedInUserVar();
  return (
    <Routes>
      <Route path="*" element={<Error404 />} />
      <Route
        path={ROUTE.AUTH}
        element={loggedInUser ? <Navigate replace to={ROUTE.HOME} /> : <Auth />}
      />
      <Route path={ROUTE.HOME} element={<Home />} />
      <Route path={`${ROUTE.BLOG}/:blogId/*`} element={<Blog />} />
      <Route path={ROUTE.CREATE_POST} element={<CreatePost />} />
      <Route path={`/blog/:blogId/edit-post/:postId`} element={<EditPost />} />
    </Routes>
  );
};

export default AppRouter;
