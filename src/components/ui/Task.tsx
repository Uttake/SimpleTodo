import { Checkbox } from "./checkbox";
import clsx from "clsx";
import CloseIcon from "../../assets/svg/xIcon2.svg?react";
import ChangeIcon from "../../assets/svg/change.svg?react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "@/Context/ContextTheme";
import { useState } from "react";
import { Input } from "./input";
import ConfirmIcon from "../../assets/svg/confirm.svg?react";

export type TaskProps = {
  onTaskDelete: (taskId: string) => void;
  onTaskToggle: (taskId: string) => void;
  onTaskEdit: (taskId: string, todo: string) => void;
  id: string;
  todo: string;
  completed: boolean;
};

const Task = ({
  onTaskToggle,
  onTaskDelete,
  onTaskEdit,
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

  const { theme } = useTheme();

  const [openEdit, setOpenEdit] = useState(false);
  const [editTask, setEditTask] = useState(todo);

  return (
    <div
      key={id}
      className="flex items-center justify-between mb-4 p-2 border-b-[1px] border-slate-400 px-4 gap-3 last:mb-0 overflow-hidden"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="flex flex-wrap items-center gap-4 ">
        <div {...listeners} className="cursor-grab touch-none max-w-[250px] ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-500 hover:text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 4.5h.01M15 4.5h.01M9 9h.01M15 9h.01M9 13.5h.01M15 13.5h.01"
            />
          </svg>
        </div>
        <Checkbox
          checked={completed}
          onClick={() => {
            onTaskToggle(id);
          }}
          className="data-[state=checked]:bg-violet-700 rounded-[50%] data-[state=checked]:border-violet-700 border-slate-400 "
        />

        {openEdit ? (
          <Input
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            className="text-black dark:text-white h-[30px]"
            autoFocus
          />
        ) : (
          <h2
            className={clsx(
              { "line-through opacity-30": completed },
              "flex-1 transition-all overflow-hidden text-black dark:text-white break-words"
            )}
          >
            {todo}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-3 justify-end">
        {openEdit ? (
          <button
            onClick={() => {
              onTaskEdit(id, editTask);
              setOpenEdit(false);
            }}
          >
            <ConfirmIcon stroke={theme === "light" ? "black" : "white"} />
          </button>
        ) : (
          <button onClick={() => setOpenEdit(true)}>
            <ChangeIcon
              width={13}
              height={13}
              stroke={theme === "light" ? "black" : "white"}
            />
          </button>
        )}

        <button
          onClick={() => {
            if (openEdit) {
              setOpenEdit(false);
              setEditTask(todo);
              return;
            }
            onTaskDelete(id);
          }}
          className="font-bold"
        >
          <CloseIcon
            fill={theme === "light" ? "black" : "white"}
            width={10}
            height={10}
          />
        </button>
      </div>
    </div>
  );
};

export default Task;
