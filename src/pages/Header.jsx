import { Button } from "@nextui-org/react";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-2">
      <div className="text-2xl text-yellow-500">Notion Tasks</div>
      <div>
        <Button color="primary">Đăng nhập</Button>
      </div>
    </div>
  );
}
