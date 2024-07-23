import { Checkbox } from "@nextui-org/react";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

export default function TodoItem(props) {
  return !props.isDeleted ? (
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
  ) : (
    <div
      onClick={() => props.handleTodoItemClick(props.id)}
      className="border-0  bg-white w-full px-3 py-2 rounded-md shadow-md mt-3 flex justify-between"
    >
      <div className="flex gap-3 justify-center">
        <Checkbox
          // onValueChange={() => props.handleCompleteCheckBox(props.id)}
          isDisabled
          isSelected={props.isCompleted}
          radius="full"
        />
        <p>{props.name}</p>
      </div>
      <div className="flex gap-3">
        {props.isImportant && <p>⭐</p>}
        <ReplayRoundedIcon
          onClick={() => props.handleRestoreTask(props.id)}
          color="primary"
          className="cursor-pointer"
        />
        <DeleteForeverRoundedIcon
          onClick={() => props.handleOnModelDelete()}
          color="error"
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
