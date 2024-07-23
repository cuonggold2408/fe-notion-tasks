import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { CATEGORY_ITEMS } from "../constants/categoryList";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import API_ROOT from "../constants/api";
import Loading from "../Loading/Loading";
import { showToast } from "../helpers/Toastify";
import { AppContext } from "../context/AppProvider";

export default function Sidebar({
  todoItem,
  handleTodoItemChange,
  setShowSidebar,
}) {
  const [name, setName] = useState(todoItem.task_name);
  const [isImportant, setIsImportant] = useState(todoItem.is_important);
  const [isCompleted, setIsCompleted] = useState(todoItem.is_completed);
  const [categoryName, setCategoryName] = useState(
    new Set([`${todoItem.category.category_name || todoItem.category}`])
  );
  const [isLoading, setIsLoading] = useState(false);

  const { setTodoList } = useContext(AppContext);

  const transformCategoryValueName = useMemo(
    () => Array.from(categoryName).join(", ").replaceAll("_", " "),
    [categoryName]
  );

  const fetchTodoList = useCallback(async () => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/task/get-task`
    );
    const data = response.data.data;
    setTodoList(data);
  }, [setTodoList]);

  const handleSave = async () => {
    const newTodo = {
      ...todoItem,
      task_name: name,
      is_important: isImportant,
      is_completed: isCompleted,
      category: transformCategoryValueName.toLowerCase(),
    };
    setIsLoading(true);
    try {
      await authorizedAxiosInstance.put(`${API_ROOT}/task/update-task`, {
        task_id: todoItem.id,
        task_name: name,
        is_important: isImportant,
        is_completed: isCompleted,
        category_name: transformCategoryValueName.toLowerCase(),
      });
      showToast("success", "Cập nhật task thành công");
      handleTodoItemChange(newTodo);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setShowSidebar(false);
    }
  };

  const handleToTrash = async () => {
    await authorizedAxiosInstance.delete(
      `${API_ROOT}/task/soft-delete-task/${todoItem.id}`
    );
    showToast("success", "Task đã được chuyển vào thùng rác");
    setShowSidebar(false);
    await fetchTodoList();
  };

  // Biến đổi category name viết hoa chữ cái đầu
  const handleTransformCategoryName = (name) => {
    const transformName =
      name.toLowerCase().charAt(0).toUpperCase() + name.slice(1);
    return transformName;
  };

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <div
        style={{
          width: "30vw",
          boxShadow: "-2px 0 3px gray",
        }}
        className="fixed top-0 right-0 bottom-0 bg-white flex flex-col justify-between"
        data-aos="fade-left"
        data-aos-duration="600"
      >
        <form className="p-3 ">
          <div className="flex flex-col gap-2 mb-3">
            <Input
              id="sb-name"
              name="name"
              placeholder="Todo name"
              value={name}
              onChange={(e) => {
                //   handleTodoNameChange(todoItem.id, e.target.value);
                setName(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className=" p-2 rounded-md flex justify-between bg-slate-100">
              <label htmlFor="sb-important">Is important?</label>
              <Checkbox
                id="sb-important"
                name="isImportant"
                isSelected={isImportant}
                onChange={() => {
                  setIsImportant(!isImportant);
                }}
              />
            </div>
            <div className=" p-2 rounded-md flex justify-between bg-slate-100">
              <label htmlFor="sb-completed">Is completed?</label>
              <Checkbox
                id="sb-completed"
                name="isCompleted"
                isSelected={isCompleted}
                onChange={() => {
                  setIsCompleted(!isCompleted);
                }}
              />
            </div>
            <div className=" p-2 rounded-md flex justify-between items-center bg-slate-100">
              <label htmlFor="">Select category</label>
              <Dropdown>
                <DropdownTrigger>
                  <Button color="secondary" variant="bordered">
                    {handleTransformCategoryName(transformCategoryValueName)}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Static Actions"
                  color="secondary"
                  selectionMode="single"
                  selectedKeys={categoryName}
                  onSelectionChange={setCategoryName}
                >
                  {CATEGORY_ITEMS.map((category) => {
                    return (
                      <DropdownItem key={category.id} value={category.id}>
                        {category.label}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </form>
        <div className="p-3 border-t-1 border-gray-500 flex justify-between">
          <div className="flex gap-3">
            <Button onClick={handleSave} color="primary" radius="sm">
              Save
            </Button>
            <Button
              onClick={() => setShowSidebar(false)}
              color="danger"
              radius="sm"
            >
              Cancel
            </Button>
          </div>
          <Button
            onClick={handleToTrash}
            className="text-red-500 font-semibold"
          >
            Delete task
          </Button>
        </div>
      </div>
    </>
  );
}
