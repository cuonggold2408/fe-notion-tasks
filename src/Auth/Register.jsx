import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: "100vh",
      }}
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
        <form className="flex flex-col gap-3">
          <Input size="md" type="text" label="Name" placeholder="Họ và tên" />
          <Input
            size="md"
            type="email"
            label="Email"
            placeholder="Email của bạn"
          />
          <Input
            size="md"
            type="password"
            label="Password"
            placeholder="Nhập mật khẩu"
          />
          <Input
            size="md"
            type="password"
            label="Password"
            placeholder="Nhập lại mật khẩu"
          />

          <Link to="/login">
            <p className="italic text-gray-500">Về trang đăng nhập</p>
          </Link>

          <Button color="secondary" className="text-xl w-full">
            Đăng ký
          </Button>
        </form>
      </div>
    </div>
  );
}
