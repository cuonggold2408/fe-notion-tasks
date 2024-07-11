import imageLogin from "/image-login.png";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
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
        <form className="flex flex-col gap-3">
          <Input size="md" type="email" label="Email" />
          <Input size="md" type="password" label="Password" />
          <Button color="primary" className="text-xl">
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
  );
}
