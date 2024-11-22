import { Checkbox } from "./checkbox";
import clsx from "clsx";
import CloseIcon from "../../assets/svg/xIcon2.svg?react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type TaskProps = {
  onTaskDelete: (taskId: string) => void;
  onTaskToggle: (taskId: string) => void;
  id: string;
  todo: string;
  completed: boolean;
};

const Task = ({
  onTaskToggle,
  onTaskDelete,
  id,
  todo,
  completed,
}: TaskProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      key={id}
      className="flex items-center mb-4 p-2 border-b-[1px] border-slate-400 px-4 gap-3 last:mb-0 overflow-hidden"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Checkbox
        checked={completed}
        onClick={() => {
          console.log(1);
          onTaskToggle(id);
        }}
        className="data-[state=checked]:bg-violet-700 rounded-[50%] data-[state=checked]:border-violet-700 border-slate-400 "
      />
      <h2
        className={clsx(
          { "line-through opacity-30": completed },
          "flex-1 transition-all overflow-hidden"
        )}
      >
        {todo}
      </h2>

      <button
        onClick={() => {
          onTaskDelete(id);
        }}
        className="font-bold"
      >
        <CloseIcon fill="#fff" width={10} height={10} />
      </button>
    </div>
  );
};

export default Task;
