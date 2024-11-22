import { task, todo } from "@/lib/definitions";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import {
  addTask,
  clearCompleted,
  deleteTask,
  deleteTodo,
  getTasks,
  toggleTask,
  updatedTask,
} from "@/store/todoSlice";
import { useEffect, useState } from "react";
import { RootState } from "@/store";

import Task from "./Task";

const itemsStyles = "text-xs text-slate-400 hover:text-blue-500 cursor-pointer";

const Todo = ({ id, title, tasks }: todo) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };
  const dispatch = useDispatch();

  const allTasks = useSelector((state: RootState) => getTasks(state, id));

  const [fillteredTasks, setFillteredTasks] = useState(allTasks);

  const onTaksAdd = (title: string) => {
    dispatch(addTask({ id: id, todo: title }));
  };

  const onTaskDelete = (taskId: string) => {
    dispatch(deleteTask({ id: id, taskId }));
  };

  const onTaskToggle = (taskId: string) => {
    dispatch(toggleTask({ id: id, taskId }));
  };

  const onClearCompleted = () => {
    dispatch(clearCompleted({ id: id }));
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

    setFillteredTasks(updatedTasks);
    dispatch(updatedTask({ id: id, tasks: updatedTasks }));
  };

  return (
    <div
      className="flex flex-col w-[460px] h-[486px] mb-4 relative"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="  border-gray-600 border-[1px] rounded-md py-4 bg-cyan-950 text-white mb-5">
        <div className="flex justify-between items-center  mb-4 px-4">
          <h2>{title}</h2>
          <button
            className="font-bold"
            onClick={() => dispatch(deleteTodo({ id: id }))}
          >
            <CloseIcon fill="#fff" />
          </button>
        </div>
        <AddForm
          btnTitle="Добавить"
          onAdd={onTaksAdd}
          className="px-4"
          placeholder="Добавьте задачу"
        />
      </div>
      <div className="bg-cyan-950 text-white py-4 rounded-md flex flex-col justify-between h-full w-full">
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
            <TransitionGroup className=" mt-4 max-h-60 h-[calc(100%-100px)] overflow-auto relative">
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
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </SortableContext>
        </DndContext>

        <div className="px-4 flex justify-between items-center">
          <span className={itemsStyles}>Кол-во задач: {tasks.length}</span>
          <div className="flex items-center gap-2">
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
