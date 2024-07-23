import { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [todoList, setTodoList] = useState([
    // {
    //   id: 1,
    //   name: "Đi học thêm",
    //   isImportant: true,
    //   isCompleted: false,
    //   isDeleted: false,
    //   category: "personal",
    // },
    // {
    //   id: 2,
    //   name: "Đi chơi",
    //   isImportant: false,
    //   isCompleted: true,
    //   isDeleted: false,
    //   category: "friends",
    // },
    // {
    //   id: 3,
    //   name: "Đi ngủ",
    //   isImportant: false,
    //   isCompleted: false,
    //   isDeleted: false,
    //   category: "idea",
    // },
  ]);

  const [selectedItemId, setSelectedItemId] = useState("all");

  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider
      value={{
        todoList,
        setTodoList,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedItemId,
        setSelectedItemId,
        searchText,
        setSearchText,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
