import { Input } from "@nextui-org/react";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import StarRateIcon from "@mui/icons-material/StarRate";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext, useMemo } from "react";
import CategoryList from "./CategoryList";
import { AppContext } from "../context/AppProvider";

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

export default function FilterPanel() {
  const {
    todoList,
    searchText,
    setSearchText,
    selectedItemId,
    setSelectedItemId,
  } = useContext(AppContext);

  const countByFilterType = useMemo(() => {
    return todoList.reduce(
      (acc, cur) => {
        let newAcc = { ...acc };
        if (cur.isCompleted) {
          newAcc = { ...newAcc, completed: newAcc.completed + 1 };
        }
        if (cur.isImportant) {
          newAcc = { ...newAcc, important: newAcc.important + 1 };
        }
        if (cur.isDeleted) {
          newAcc = { ...newAcc, deleted: newAcc.deleted + 1 };
        }
        return newAcc;
      },
      { all: todoList.length, important: 0, completed: 0, deleted: 0 }
    );
  }, [todoList]);

  return (
    <div className="bg-white p-3" style={{ flex: 1 }}>
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
    </div>
  );
}
