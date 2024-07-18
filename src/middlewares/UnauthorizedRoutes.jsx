import { Navigate, Outlet } from "react-router-dom";

export default function UnauthorizedRoutes() {
  const isLogin = JSON.parse(localStorage.getItem("isLogin"));
  if (isLogin) {
    return <Navigate to="/" replace={true} />;
  }

  return <Outlet />;
}
