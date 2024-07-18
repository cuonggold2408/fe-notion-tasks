import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import API_ROOT from "../constants/api";
import { ToastContainer } from "react-toastify";
import { showToast } from "../helpers/Toastify";
import { useState } from "react";
import Loading from "../Loading/Loading";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      password_confirm: formData.get("password_confirm"),
    };
    try {
      const response = await authorizedAxiosInstance.post(
        `${API_ROOT}/auth/register`,
        { ...userData }
      );

      if (response?.data?.status === 201) {
        showToast("success", "Đăng ký thành công", () => {
          navigate("/login");
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loading />}
      <div
        className="flex items-center justify-center"
        style={{ height: "100vh" }}
      >
        <div
          className="flex flex-col border-1 p-6 gap-3 rounded-md shadow-md"
          style={{
            width: "500px",
          }}
        >
          <h1 className="text-center text-xl">Chào bạn</h1>
          <p className="text-center text-gray-400">
            Đăng ký để được trải nghiệm Notion Tasks ❤️
          </p>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <Input
              size="md"
              type="text"
              label="Name"
              name="name"
              placeholder="Họ và tên"
            />
            <Input
              size="md"
              type="email"
              label="Email"
              name="email"
              placeholder="Email của bạn"
            />
            <Input
              size="md"
              type="password"
              label="Password"
              name="password"
              placeholder="Nhập mật khẩu"
            />
            <Input
              size="md"
              type="password"
              label="Password"
              name="password_confirm"
              placeholder="Nhập lại mật khẩu"
            />

            <Link to="/login">
              <p className="italic text-gray-500">Về trang đăng nhập</p>
            </Link>

            <Button type="submit" color="secondary" className="text-xl w-full">
              Đăng ký
            </Button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
