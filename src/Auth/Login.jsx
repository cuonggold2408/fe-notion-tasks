import imageLogin from "/image-login.png";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import API_ROOT from "../constants/api";
import { showToast } from "../helpers/Toastify";
import { ToastContainer } from "react-toastify";
import { useContext, useState } from "react";
import Loading from "../Loading/Loading";
import { AppContext } from "../context/AppProvider";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AppContext);
  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/auth/login`,
      {
        ...userData,
      }
    );

    localStorage.setItem("isLogin", true);

    showToast("success", "Đăng nhập thành công", async () => {
      try {
        setIsLoading(true);

        setUser(response?.data?.data?.user);
        navigate("/");
      } catch (error) {
        console.error("Error during login:", error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      {isLoading && <Loading />}
      <div
        className="flex items-center justify-center gap-10"
        style={{
          height: "100vh",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            backgroundColor: "black",
            borderRadius: "10px",
          }}
          className="relative"
        >
          <img src={imageLogin} alt="image-login" className="p-20" />
          <span
            className="text-yellow-400 absolute top-14 text-2xl italic"
            style={{
              transform: "rotate(-45deg)",
            }}
          >
            Notion Tasks
          </span>
        </div>
        <div
          className="flex flex-col border-1 p-6 gap-3 rounded-md shadow-md"
          style={{
            width: "500px",
          }}
        >
          <h1 className="text-center text-xl">Hello</h1>
          <p className="text-center text-gray-400">
            Chào mừng bạn đến với Notion Tasks của mình ❤️
          </p>
          <form className="flex flex-col gap-3" onSubmit={handleLogin}>
            <Input size="md" type="email" name="email" label="Email" />
            <Input size="md" type="password" name="password" label="Password" />
            <Button type="submit" color="primary" className="text-xl">
              Đăng nhập
            </Button>
          </form>
          <Link to="/register">
            <p className="text-center border-1 p-2 text-xl rounded-xl bg-red-500 text-white hover:bg-red-400">
              Đăng ký
            </p>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
