import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { CATEGORY_ITEMS } from "../constants/categoryList";

export default function Sidebar({
  todoItem,
  handleTodoItemChange,
  setShowSidebar,
}) {
  const [name, setName] = useState(todoItem.name);
  const [isImportant, setIsImportant] = useState(todoItem.isImportant);
  const [isCompleted, setIsCompleted] = useState(todoItem.isCompleted);
  const [categoryName, setCategoryName] = useState(
    new Set([`${todoItem.category}`])
  );

  const transformCategoryValueName = useMemo(
    () => Array.from(categoryName).join(", ").replaceAll("_", " "),
    [categoryName]
  );

  const handleSave = () => {
    const newTodo = {
      ...todoItem,
      name,
      isImportant,
      isCompleted,
      category: transformCategoryValueName.toLowerCase(),
    };
    handleTodoItemChange(newTodo);
    setShowSidebar(false);
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
      <div className="p-3 border-t-1 border-gray-500 flex gap-3">
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
    </div>
  );
}
