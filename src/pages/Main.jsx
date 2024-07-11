import { useContext, useMemo, useState } from "react";
import TodoItem from "../components/TodoItem";
import Sidebar from "../components/Sidebar";
import FilterPanel from "../components/FilterPanel";
import { AppContext } from "../context/AppProvider";

export default function Main() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTodoItemId, setActiveTodoItemId] = useState(null);

  const {
    selectedCategoryId,
    todoList,
    setTodoList,
    searchText,
    selectedItemId,
  } = useContext(AppContext);

  const handleCompleteCheckBox = (todoId) => {
    const newTodoList = todoList.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, isCompleted: !todo.isCompleted };
      }
      return todo;
    });
    setTodoList(newTodoList);
  };

  const handleTodoItemClick = (todoId) => {
    setShowSidebar(true);
    setActiveTodoItemId(todoId);
  };

  const activeTodoItem = todoList.find((todo) => todo.id === activeTodoItemId);

  const handleTodoItemChange = (newTodo) => {
    const newTodoList = todoList.map((todo) => {
      if (todo.id === newTodo.id) {
        return newTodo;
      }
      return todo;
    });
    setTodoList(newTodoList);
  };

  const filterTasks = useMemo(() => {
    return todoList.filter((todo) => {
      if (!todo.name.toLowerCase().includes(searchText)) {
        return false;
      }

      if (selectedCategoryId && todo.category !== selectedCategoryId) {
        return false;
      }

      switch (selectedItemId) {
        case "important":
          return todo.isImportant;
        case "completed":
          return todo.isCompleted;
        case "deleted":
          return todo.isDeleted;
        case "all":
        default:
          return !todo.isDeleted;
      }
    });
  }, [todoList, selectedItemId, searchText, selectedCategoryId]);
  return (
    <div className="flex">
      <FilterPanel />
      <div className="bg-slate-300 p-7 rounded-s-md" style={{ flex: 2 }}>
        <input
          className="border-0 outline-none bg-white w-full px-3 py-2 rounded-md shadow-md"
          type="text"
          name="add-new-task"
          placeholder="Add new task"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const newTask = {
                id: crypto.randomUUID(),
                name: e.target.value,
                isCompleted: false,
                isImportant: false,
                isDeleted: false,
                category: "personal",
              };
              setTodoList([...todoList, newTask]);
              e.target.value = "";
            }
          }}
        />
        <div>
          {filterTasks.map((todo) => {
            return (
              <TodoItem
                key={todo.id}
                name={todo.name}
                id={todo.id}
                isImportant={todo.isImportant}
                isCompleted={todo.isCompleted}
                handleCompleteCheckBox={handleCompleteCheckBox}
                handleTodoItemClick={handleTodoItemClick}
              />
            );
          })}
        </div>
        {showSidebar && (
          <Sidebar
            key={activeTodoItemId}
            todoItem={activeTodoItem}
            handleTodoItemChange={handleTodoItemChange}
            setShowSidebar={setShowSidebar}
          />
        )}
      </div>
    </div>
  );
}
