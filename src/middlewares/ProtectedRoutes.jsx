import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const isLogin = JSON.parse(localStorage.getItem("isLogin"));
  if (!isLogin) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Outlet />;
}
