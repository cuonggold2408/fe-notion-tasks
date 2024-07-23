import { AvatarIcon, Input } from "@nextui-org/react";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import StarRateIcon from "@mui/icons-material/StarRate";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext, useEffect, useMemo, useState } from "react";
import CategoryList from "./CategoryList";
import { AppContext } from "../context/AppProvider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import API_ROOT from "../constants/api";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";

const FILTER_ITEMS = [
  {
    id: "all",
    label: "All",
    iconPath: <AllInboxIcon className="text-white" />,
  },
  {
    id: "important",
    label: "Important",
    iconPath: <StarRateIcon className="text-yellow-500" />,
  },
  {
    id: "completed",
    label: "Completed",
    iconPath: <TaskAltIcon className="text-green-500" />,
  },
  {
    id: "deleted",
    label: "Deleted",
    iconPath: <DeleteIcon className="text-red-500" />,
  },
];

// Hàm chuyển thành tên không dấu không cách
const handleChangeName = (name) => {
  const newName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("");
  return newName.toLowerCase();
};

// Hàm viết hoa chữ cái đầu mỗi từ của tên
const handleUpperCaseName = (name) => {
  const newName = name.split(" ").map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  });
  return newName.join(" ");
};

export default function FilterPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    todoList,
    searchText,
    setSearchText,
    selectedItemId,
    setSelectedItemId,
    user,
    setUser,
  } = useContext(AppContext);

  const countByFilterType = useMemo(() => {
    const deleteList = todoList.filter((item) => item.deletedAt);
    return todoList.reduce(
      (acc, cur) => {
        let newAcc = { ...acc };
        if (cur.is_completed && !cur.deletedAt) {
          newAcc = { ...newAcc, completed: newAcc.completed + 1 };
        }
        if (cur.is_important && !cur.deletedAt) {
          newAcc = { ...newAcc, important: newAcc.important + 1 };
        }
        if (cur.deletedAt) {
          newAcc = { ...newAcc, deleted: newAcc.deleted + 1 };
        }
        return newAcc;
      },
      {
        all: todoList.length - deleteList.length,
        important: 0,
        completed: 0,
        deleted: 0,
      }
    );
  }, [todoList]);

  const handleLogOut = async () => {
    localStorage.removeItem("isLogin");
    await authorizedAxiosInstance.delete(`${API_ROOT}/auth/logout`);

    navigate("/login");
  };

  // const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchDataUser = async () => {
      setIsLoading(true);
      try {
        const response = await authorizedAxiosInstance.get(
          `${API_ROOT}/user/profile`
        );
        setUser(response?.data?.data?.user);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataUser();
  }, [setUser]);

  return (
    <>
      {isLoading && <Loading />}
      <div className="bg-white p-3 relative" style={{ flex: 1 }}>
        <Input
          placeholder="Search"
          variant="faded"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-5">
          {FILTER_ITEMS.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`rounded-md p-2 flex justify-between cursor-pointer ${
                  item.id === selectedItemId
                    ? "text-white bg-sky-600"
                    : "bg-slate-300"
                }`}
              >
                <div className="">
                  {item.iconPath}
                  <p>{item.label}</p>
                </div>
                <p>{countByFilterType[item.id]}</p>
              </div>
            );
          })}
        </div>
        {/* CategoryList */}
        <CategoryList />

        {user && (
          <div className="absolute bottom-0 flex items-center gap-2">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  icon={<AvatarIcon />}
                  classNames={{
                    base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                    icon: "text-black/80",
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">@{handleChangeName(user.name)}</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem
                  onClick={handleLogOut}
                  key="logout"
                  color="danger"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div>
              <p className="font-semibold">{handleUpperCaseName(user.name)}</p>
              <p className="text-sm text-gray-400">
                @{handleChangeName(user.name)}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
