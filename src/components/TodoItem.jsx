import { Checkbox } from "@nextui-org/react";

export default function TodoItem(props) {
  return (
    <div
      onClick={() => props.handleTodoItemClick(props.id)}
      className="border-0  bg-white w-full px-3 py-2 rounded-md shadow-md mt-3 flex justify-between cursor-pointer"
    >
      <div className="flex gap-3 justify-center">
        <Checkbox
          onValueChange={() => props.handleCompleteCheckBox(props.id)}
          isSelected={props.isCompleted}
          radius="full"
        />
        <p>{props.name}</p>
      </div>
      {props.isImportant && <p>⭐</p>}
    </div>
  );
}
