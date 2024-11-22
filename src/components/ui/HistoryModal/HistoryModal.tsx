import styles from "./HistoryModal.module.css";
import HistoryTask from "./HistoryTask";
import clsx from "clsx";
import { todo } from "@/lib/definitions";
import { Button } from "../button";
import CloseIcon from "../../../assets/svg/xIcon2.svg?react";
import { useDispatch } from "react-redux";
import { removeHistory, restoreHistory } from "@/store/todoSlice";
import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
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
        className={styles.modal}
        style={{ right: `-${isOpen ? 0 : width}px`, width: `${width}px` }}
      >
        <div className=" max-h-[650px] overflow-y-auto pb-5 pr-5 pl-5">
          <button onClick={handleOverlay}>
            <CloseIcon fill="#fff" className="absolute top-4 right-4" />
          </button>
          {historyData?.map((todo) => (
            <div
              key={todo.id}
              className="flex flex-col justify-center items-center mb-4 last:mb-0 p-4 border-[1px] border-slate-400 rounded-3xl"
            >
              <h2
                className="text-xl font-bold cursor-pointer"
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
                <div className="overflow-hidden mt-5">
                  <div className="max-h-36 overflow-y-auto">
                    {todo.tasks.map((task) => (
                      <HistoryTask
                        key={task.id}
                        id={task.id}
                        todo={task.todo}
                        completed={task.completed}
                      />
                    ))}
                    {todo.tasks.length === 0 && (
                      <span className="flex justify-center items-center text-sm">
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
            <p className="flex justify-center items-center">Нет истории</p>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryModal;
