import notFoundImage from "/404notfound.jpg";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <h2>Lạc đường rồi. Vui lòng quay lại trang chủ</h2>
      <img
        src={notFoundImage}
        alt="404 not found"
        style={{ maxWidth: "60%", height: "auto" }}
      />

      <button className="relative inline-flex items-center justify-center p-0.5 mt-3 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
        <Link
          to="/"
          className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
        >
          Về trang chủ
        </Link>
      </button>
    </div>
  );
}
