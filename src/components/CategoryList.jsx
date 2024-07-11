import { useContext, useMemo } from "react";
import { CATEGORY_ITEMS } from "../constants/categoryList";
import { AppContext } from "../context/AppProvider";
import FolderIcon from "@mui/icons-material/Folder";

export default function CategoryList() {
  const { selectedCategoryId, setSelectedCategoryId, todoList } =
    useContext(AppContext);

  const countByCategory = useMemo(() => {
    return todoList.reduce(
      (acc, cur) => {
        switch (cur.category) {
          case "personal":
            return { ...acc, personal: acc.personal + 1 };
          case "company":
            return { ...acc, company: acc.company + 1 };
          case "idea":
            return { ...acc, idea: acc.idea + 1 };
          case "friends":
            return { ...acc, friends: acc.friends + 1 };
          default:
            return acc;
        }
      },
      {
        personal: 0,
        company: 0,
        idea: 0,
        friends: 0,
      }
    );
  }, [todoList]);

  return (
    <div className="mt-5">
      <p className="font-semibold text-gray-400">Categories</p>
      <div className="mt-2">
        {CATEGORY_ITEMS.map((category) => {
          return (
            <div
              key={category.id}
              className={`flex justify-between p-2 cursor-pointer rounded-md ${
                category.id === selectedCategoryId
                  ? "bg-pink-500 text-white"
                  : "hover:bg-gray-100"
              } `}
              onClick={() => {
                if (category.id === selectedCategoryId) {
                  setSelectedCategoryId(null);
                  return;
                }
                setSelectedCategoryId(category.id);
              }}
            >
              <div className="flex gap-2">
                <FolderIcon className="text-gray-400" />
                <p className="font-semibold">{category.label}</p>
              </div>
              <p
                className={`font-semibold  ${
                  category.id === selectedCategoryId
                    ? "bg-pink-500 text-white"
                    : "text-gray-400"
                } `}
              >
                {countByCategory[category.id]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
