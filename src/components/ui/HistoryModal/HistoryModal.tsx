import styles from "./HistoryModal.module.css";
import HistoryTask from "./HistoryTask";
import clsx from "clsx";
import { todo } from "@/lib/definitions";
import { Button } from "../button";
import CloseIcon from "../../../assets/svg/xIcon2.svg?react";
import { useDispatch } from "react-redux";
import { clearHistory, removeHistory, restoreHistory } from "@/store/todoSlice";
import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useTheme } from "@/Context/ContextTheme";
type HistoryModalTypes = {
  isOpen: boolean;
  width: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  historyData: todo[];
};

const HistoryModal = ({
  isOpen,
  width,
  setIsOpen,
  historyData,
}: HistoryModalTypes) => {
  const handleOverlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const dispatch = useDispatch();
  const [tasksOpen, setTasksOpen] = useState("");
  const { theme } = useTheme();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  return (
    <>
      <div
        className={clsx(styles.overlay, { [styles.open]: isOpen })}
        onClick={handleOverlay}
      ></div>
      <div
        data-theme={theme}
        className={styles.modal}
        style={{ right: `-${isOpen ? 0 : width}px`, width: `${width}px` }}
      >
        <h2 className="text-center font-bold text-black mb-3 dark:text-white">
          Архив списков
        </h2>
        <div className=" max-h-[550px] overflow-y-auto pb-5 pr-5 pl-5">
          <button onClick={handleOverlay}>
            <CloseIcon fill="#000" className="absolute top-4 right-4" />
          </button>
          {historyData?.map((todo) => (
            <div
              key={todo.id}
              className="flex flex-col justify-center items-center mb-4 last:mb-0  bg-[#f5edf0] rounded-md dark:bg-[#272A36]"
            >
              <h2
                className={clsx(
                  "text-xl font-bold cursor-pointer w-full h-full text-center text-black p-4 dark:text-white rounded-md  border-b-[1px] border-slate-300"
                )}
                onClick={() =>
                  setTasksOpen((prev) => (prev === todo.id ? "" : todo.id))
                }
              >
                {todo.title}
              </h2>

              <CSSTransition
                in={tasksOpen === todo.id}
                timeout={300}
                classNames="history"
                unmountOnExit
              >
                <div className="overflow-hidden p-4">
                  <div className="max-h-36 overflow-y-auto ">
                    {todo.tasks.map((task) => (
                      <HistoryTask
                        key={task.id}
                        id={task.id}
                        todo={task.todo}
                        completed={task.completed}
                      />
                    ))}
                    {todo.tasks.length === 0 && (
                      <span className="flex justify-center items-center text-sm text-black dark:text-white">
                        {" "}
                        Нет задач
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between gap-6 mt-6">
                    <Button
                      className="text-xs p-2"
                      variant={"default"}
                      onClick={() => dispatch(restoreHistory({ id: todo.id }))}
                    >
                      Восстановить
                    </Button>
                    <Button
                      className="text-xs p-2"
                      variant={"destructive"}
                      onClick={() => dispatch(removeHistory({ id: todo.id }))}
                    >
                      Очистить
                    </Button>
                  </div>
                </div>
              </CSSTransition>
            </div>
          ))}
          {historyData.length === 0 && (
            <p className="flex justify-center items-center text-black dark:text-white">
              Нет истории
            </p>
          )}
        </div>
        {historyData.length > 0 && (
          <div className="flex justify-center items-center mt-4">
            <Button
              onClick={() => dispatch(clearHistory())}
              variant={"destructive"}
            >
              Очистить все
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryModal;
