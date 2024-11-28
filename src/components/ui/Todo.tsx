import { task, todo } from "@/lib/definitions";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ChangeIcon from "../../assets/svg/change.svg?react";
import AddForm from "./AddForm";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "../../assets/svg/xIcon2.svg?react";
import ConfirmIcon from "../../assets/svg/confirm.svg?react";
import { getTasks, updatedTask } from "@/store/todoSlice";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store";

import Task from "./Task";
import { useTheme } from "@/Context/ContextTheme";
import clsx from "clsx";
import { Input } from "./input";
import {
  addNewTask,
  deleteCompletedTasks,
  removeTask,
  removeTodo,
  toggleTaskCompleted,
  updateTaskOrder,
  updateTaskTitle,
  updateTodoTitle,
} from "@/services/todoServices";

const itemsStyles =
  "text-xs text-slate-400 hover:text-blue-500 cursor-pointer sm:basis-1/3 ";

const Todo = ({ id, title, tasks }: todo) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  const dispatch = useDispatch<AppDispatch>();

  const { theme } = useTheme();
  const allTasks = useSelector((state: RootState) => getTasks(state, id));
  const user = useSelector((state: RootState) => state?.auth.user);

  if (!user) return;
  const userId = user?.id;

  const [fillteredTasks, setFillteredTasks] = useState(allTasks);
  const [todoEdit, setTodoEdit] = useState(false);
  const [editTodoTitle, setEditTodoTitle] = useState(title);

  const onTaksAdd = (title: string) => {
    dispatch(addNewTask({ todoId: id, title }));
  };

  const onTaskDelete = (taskId: string) => {
    dispatch(removeTask({ todoId: id, id: taskId }));
  };

  const onTaskToggle = (taskId: string) => {
    dispatch(toggleTaskCompleted({ todoId: id, id: taskId }));
  };

  const onClearCompleted = () => {
    dispatch(deleteCompletedTasks({ todoId: id }));
  };

  const onTaskEdit = (taskId: string, todo: string) => {
    dispatch(updateTaskTitle({ todoId: id, id: taskId, newTitle: todo }));
  };

  const onTodoEdit = (id: string, newTitle: string) => {
    dispatch(updateTodoTitle({ id: id, user_id: userId, title: newTitle }));
  };

  const onTodoDelete = (id: string) => {
    dispatch(removeTodo({ id: id, user_id: userId }));
  };

  const filteredTasks = (filter: string) => {
    switch (filter) {
      case "all":
        setFillteredTasks(tasks);
        break;
      case "active":
        setFillteredTasks(tasks.filter((el) => !el.completed));
        break;
      case "completed":
        setFillteredTasks(tasks.filter((el) => el.completed));
        break;
      default:
        return setFillteredTasks(tasks);
    }
  };

  useEffect(() => {
    setFillteredTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 80,
        tolerance: 3,
      },
    })
  );

  const handleDragEnd = ({ active, over }: { active: any; over: any }) => {
    if (!active || !over || active.id === over.id) {
      return;
    }

    const oldIndex = fillteredTasks.findIndex(
      (task: task) => task.id === active.id
    );
    const newIndex = fillteredTasks.findIndex(
      (task: task) => task.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const updatedTasks: task[] = arrayMove(fillteredTasks, oldIndex, newIndex);

    const tasksWithNewPositions = updatedTasks.map((task, index) => ({
      ...task,
      position: index + 1,
    }));

    setFillteredTasks(tasksWithNewPositions);
    dispatch(updatedTask({ id: id, tasks: updatedTasks }));
    dispatch(updateTaskOrder({ tasks: tasksWithNewPositions, todoId: id }));
  };

  return (
    <div
      data-theme={theme}
      className="flex flex-col w-[460px] h-[486px] mb-4 relative group  sm:max-w-[460px] sm:w-full sm:px-3"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div
        className=" rounded-md py-4 dark:bg-[#272A36] bg-[#f5edf0] text-white mb-5 touch-none"
        {...listeners}
      >
        <div className="flex justify-between items-center  mb-4 px-4">
          <div className="flex items-center gap-4">
            {todoEdit ? (
              <Input
                value={editTodoTitle}
                onChange={(e) => setEditTodoTitle(e.target.value)}
                className="text-black dark:text-white h-[30px]"
                autoFocus
              />
            ) : (
              <h2 className=" text-black dark:text-white">{title}</h2>
            )}
            <div className={clsx({ "flex items-center gap-3": todoEdit })}>
              <button
                onClick={() => {
                  if (todoEdit) {
                    onTodoEdit(id, editTodoTitle);
                    setTodoEdit(false);
                    return;
                  }
                  setTodoEdit(true);
                }}
              >
                {!todoEdit ? (
                  <ChangeIcon
                    stroke={theme === "dark" ? "#fff" : "#000"}
                    width={13}
                    height={13}
                  />
                ) : (
                  <ConfirmIcon
                    stroke={theme === "dark" ? "#fff" : "#000"}
                    width={13}
                    height={13}
                  />
                )}
              </button>
              {todoEdit && (
                <button
                  onClick={() => {
                    setTodoEdit(false);
                    setEditTodoTitle(title);
                  }}
                >
                  <CloseIcon
                    fill={theme === "light" ? "black" : "white"}
                    width={12}
                    height={12}
                  />
                </button>
              )}
            </div>
          </div>
          <button className="font-bold" onClick={() => onTodoDelete(id)}>
            <CloseIcon fill={theme === "dark" ? "#fff" : "#000"} />
          </button>
        </div>
        <AddForm
          btnTitle="Добавить"
          onAdd={onTaksAdd}
          className="px-4"
          placeholder="Добавьте задачу"
        />
      </div>
      <div className="dark:bg-[#272A36] bg-[#f5edf0] text-white py-4 rounded-md flex flex-col justify-between h-full w-full">
        {!tasks.length && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 ">
            Задачи отсутствуют
          </span>
        )}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          sensors={sensors}
        >
          <SortableContext
            items={fillteredTasks.map((item: task) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <TransitionGroup className="mt-4 max-h-60 h-[calc(100%-100px)] overflow-y-auto relative">
              {fillteredTasks.map((el: task) => (
                <CSSTransition
                  key={el.id}
                  timeout={300}
                  classNames="task"
                  unmountOnExit
                >
                  <Task
                    id={el.id}
                    todo={el.todo}
                    completed={el.completed}
                    onTaskDelete={onTaskDelete}
                    onTaskToggle={onTaskToggle}
                    onTaskEdit={onTaskEdit}
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </SortableContext>
        </DndContext>

        <div className="px-4 flex justify-between items-center sm:gap-2 sm:px-1">
          <span className={itemsStyles}>Кол-во задач: {tasks.length}</span>
          <div className="flex items-center gap-2 basis-1/3">
            <span className={itemsStyles} onClick={() => filteredTasks("all")}>
              Все
            </span>
            <span
              className={itemsStyles}
              onClick={() => filteredTasks("active")}
            >
              Активные
            </span>
            <span
              className={itemsStyles}
              onClick={() => filteredTasks("completed")}
            >
              Выполненные
            </span>
          </div>
          <span className={itemsStyles} onClick={onClearCompleted}>
            Очистить выполненные
          </span>
        </div>
      </div>
    </div>
  );
};

export default Todo;
