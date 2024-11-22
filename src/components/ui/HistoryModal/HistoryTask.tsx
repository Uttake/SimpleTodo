import { task } from "@/lib/definitions";
import { Checkbox } from "@radix-ui/react-checkbox";
import clsx from "clsx";

const HistoryTask = ({ id, todo, completed }: task) => {
  return (
    <div
      key={id}
      className="flex mt-4 items-center text-white w-full justify-between max-w-44"
    >
      <div className="relative">
        <Checkbox
          checked={completed}
          className={` checked:text-white data-[state=checked]:bg-black rounded-[50%] data-[state=checked]:border-black border-[1px] border-slate-400 w-4 h-4`}
        />
        {completed && (
          <span className="text-white text-xs absolute top-[5px] left-[4px]">
            ✓
          </span>
        )}
      </div>
      <h2 className={clsx({ "line-through opacity-30": completed }, "text-sm")}>
        {todo}
      </h2>
    </div>
  );
};

export default HistoryTask;
