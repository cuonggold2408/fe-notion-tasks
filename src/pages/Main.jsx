import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import TodoItem from "../components/TodoItem";
import Sidebar from "../components/Sidebar";
import FilterPanel from "../components/FilterPanel";
import { AppContext } from "../context/AppProvider";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import API_ROOT from "../constants/api";
import { showToast } from "../helpers/Toastify";
import _ from "lodash";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Loading from "../Loading/Loading";

export default function Main() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTodoItemId, setActiveTodoItemId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const {
    selectedCategoryId,
    todoList,
    setTodoList,
    searchText,
    selectedItemId,
  } = useContext(AppContext);

  const fetchTodoList = useCallback(async () => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/task/get-task`
    );
    const data = response.data.data;
    setTodoList(data);
  }, [setTodoList]);

  useEffect(() => {
    fetchTodoList();
  }, [fetchTodoList]);

  const handleAddNewTask = async (e) => {
    // (e) => {
    //   if (e.key === "Enter") {
    //     const newTask = {
    //       id: crypto.randomUUID(),
    //       name: e.target.value,
    //       isCompleted: false,
    //       isImportant: false,
    //       isDeleted: false,
    //       category: "personal",
    //     };
    //     setTodoList([...todoList, newTask]);
    //     e.target.value = "";
    //   }
    // }
    const newTask = {
      task_name: e.target.value,
    };
    if (e.key === "Enter") {
      await authorizedAxiosInstance.post(
        `${API_ROOT}/task/create-task`,
        newTask
      );
      e.target.value = "";
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/task/get-task`
      );
      setTodoList(response.data.data);
      showToast("success", "Thêm task thành công");
    }
  };

  const updateStatus = async (todoId, isCompleted) => {
    await authorizedAxiosInstance.put(`${API_ROOT}/task/update-status`, {
      task_id: todoId,
      is_completed: isCompleted,
    });
    showToast("success", "Cập nhật trạng thái task thành công");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateStatus = useCallback(
    _.debounce((todoId, isCompleted) => {
      updateStatus(todoId, isCompleted);
    }, 800),
    []
  );

  const handleCompleteCheckBox = async (todoId) => {
    const todo = todoList.find((todo) => todo.id === todoId);

    const newTodoList = todoList.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, is_completed: !todo.is_completed };
      }
      return todo;
    });
    setTodoList(newTodoList);

    debouncedUpdateStatus(todoId, !todo.is_completed);
  };

  const handleTodoItemClick = (todoId) => {
    setShowSidebar(true);
    setActiveTodoItemId(todoId);
  };

  const handleRestoreTask = async (todoId) => {
    await authorizedAxiosInstance.put(`${API_ROOT}/task/restore-task`, {
      task_id: todoId,
    });
    showToast("success", "Khôi phục task thành công");
    await fetchTodoList();
    setShowSidebar(false);
  };
  const handleDeleteTaskForever = async () => {
    setIsLoading(true);
    try {
      await authorizedAxiosInstance.delete(
        `${API_ROOT}/task/delete-task/${activeTodoItemId}`
      );
      showToast("success", "Xóa task thành công");
      await fetchTodoList();
      setShowSidebar(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOnModelDelete = () => {
    onOpen();
  };

  const activeTodoItem = todoList.find(
    (todo) => todo.id === activeTodoItemId && todo.deletedAt === null
  );

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
    return todoList?.filter((todo) => {
      if (!todo.task_name?.toLowerCase().includes(searchText)) {
        return false;
      }

      if (
        selectedCategoryId &&
        (todo?.category?.category_name || todo?.category) !== selectedCategoryId
      ) {
        return false;
      }

      switch (selectedItemId) {
        case "important":
          return todo.is_important && !todo.deletedAt;
        case "completed":
          return todo.is_completed && !todo.deletedAt;
        case "deleted":
          return todo.deletedAt;
        case "all":
        default:
          return !todo.deletedAt;
      }
    });
  }, [todoList, selectedItemId, searchText, selectedCategoryId]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/task/get-task`
      );
      setTodoList(response.data.data);
    };
    fetchData();
  }, [setTodoList]);

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex">
        <FilterPanel />
        <div className="bg-slate-300 p-7 rounded-s-md" style={{ flex: 2 }}>
          <input
            className="border-0 outline-none bg-white w-full px-3 py-2 rounded-md shadow-md"
            type="text"
            name="add-new-task"
            placeholder="Add new task"
            onKeyDown={handleAddNewTask}
          />
          <div>
            {filterTasks.map((todo) => {
              return (
                <TodoItem
                  key={todo.id}
                  name={todo.task_name}
                  id={todo.id}
                  isImportant={todo.is_important}
                  isCompleted={todo.is_completed}
                  isDeleted={todo.deletedAt}
                  handleCompleteCheckBox={handleCompleteCheckBox}
                  handleTodoItemClick={handleTodoItemClick}
                  handleRestoreTask={handleRestoreTask}
                  handleOnModelDelete={handleOnModelDelete}
                />
              );
            })}
          </div>
          {showSidebar && selectedItemId !== "deleted" && (
            <Sidebar
              key={activeTodoItemId}
              todoItem={activeTodoItem}
              handleTodoItemChange={handleTodoItemChange}
              setShowSidebar={setShowSidebar}
            />
          )}
        </div>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-500">
                Xoá tasks
              </ModalHeader>
              <ModalBody>
                <p className="text-xl font-semibold">
                  Nếu bạn xoá task này thì task sẽ không thể khôi phục lại.
                </p>
                <p>Bạn có chắc chắn muốn xoá task này vĩnh viễn không?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button
                  onClick={handleDeleteTaskForever}
                  color="primary"
                  onPress={onClose}
                >
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
