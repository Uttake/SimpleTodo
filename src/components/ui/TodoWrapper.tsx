import { useDispatch, useSelector } from "react-redux";

import { getHistoryTodo, getTodos, updateTodos } from "../../store/todoSlice";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import HistoryIcon from "../../assets/svg/archive.svg?react";
import LogOut from "../../assets/svg/logout.svg?react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import Todo from "../../components/ui/Todo";
import ThemeToggle from "../../components/ui/ThemeToggle/ThemeToggle";
import { useTheme } from "../../Context/ContextTheme";
import TypeWritter from "../../components/ui/TypeWritter";
import AddForm from "./AddForm";
import HistoryModal from "./HistoryModal/HistoryModal";
import { AppDispatch } from "@/store";
import { addNewTodo, updateTodosOrder } from "@/services/todoServices";
import { logout } from "@/store/authSlice";
import { supabase } from "@/services/supabaseClient";

const TodoWrapper = () => {
  const todos = useSelector(getTodos);
  const history = useSelector(getHistoryTodo);
  const dispatch = useDispatch<AppDispatch>();
  const [allTodos, setAllTodos] = useState(todos);

  const logOut = async () => {
    await supabase.auth.signOut();
  };
  const [historyOpen, setHistoryOpen] = useState(false);
  const { theme } = useTheme();

  const onTodoAdd = (title: string) => {
    dispatch(addNewTodo({ title }));
  };

  const handleDragEnd = ({ active, over }: { active: any; over: any }) => {
    if (active.id !== over?.id) {
      const oldIndex = allTodos.findIndex((todo) => todo.id === active.id);
      const newIndex = allTodos.findIndex((todo) => todo.id === over.id);

      const updatedTodos = arrayMove(allTodos, oldIndex, newIndex);

      setAllTodos(updatedTodos);

      const updates = updatedTodos.map((todo, index) => ({
        ...todo,
        id: todo.id,
        position: index + 1,
      }));

      dispatch(updateTodos({ todos: updatedTodos }));
      dispatch(updateTodosOrder({ todos: updates }));
    }
  };

  useEffect(() => {
    setAllTodos(todos);
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 80,
        tolerance: 3,
      },
    })
  );
  return (
    <>
      <div
        className={clsx(
          "flex flex-col pt-5 relative z-20 max-w-[1440px] my-0 mx-auto items-center "
        )}
      >
        <h1 className=" self-start  text-xl">ＴＯＤＯ</h1>
        <div className=" mb-5 flex justify-center items-center flex-wrap w-full gap-5 md:pt-5 md:px-3 ">
          <div className="max-w-[400px] w-full">
            <AddForm
              btnTitle="Добавить"
              onAdd={onTodoAdd}
              placeholder="Создайте новый список"
            />
          </div>
          <ThemeToggle />
        </div>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
          sensors={sensors}
        >
          <SortableContext
            items={allTodos.map((todo) => todo.id)}
            strategy={rectSortingStrategy}
          >
            <TransitionGroup
              className={clsx(
                "flex gap-x-4 justify-center gap-y-4 duration-300 transition-all ease-in-out flex-wrap basis-1/3"
              )}
            >
              {allTodos.map((todo) => (
                <CSSTransition
                  key={todo.id}
                  timeout={300}
                  classNames="todo"
                  unmountOnExit
                >
                  <Todo id={todo.id} title={todo.title} tasks={todo.tasks} />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </SortableContext>
        </DndContext>
      </div>

      <div
        data-theme={theme}
        className="text-white text-lg absolute z-40 right-[5%] top-5 flex gap-6 items-center"
      >
        <button
          className={clsx("relative z-40 text-black dark:text-white")}
          style={{
            display: historyOpen ? "none" : "block",
          }}
          onClick={() => setHistoryOpen(true)}
        >
          <HistoryIcon
            width={25}
            height={25}
            fill={
              history.length > 0 ? "red" : theme === "dark" ? "#fff" : "#000"
            }
          />
        </button>
        <HistoryModal
          isOpen={historyOpen}
          width={300}
          setIsOpen={setHistoryOpen}
          historyData={history}
        />
        <div className="flex justify-center items-center">
          <button
            onClick={() => {
              dispatch(logout());
              logOut();
            }}
          >
            <LogOut
              width={25}
              height={25}
              fill={theme === "dark" ? "#fff" : "#000"}
            />
          </button>
        </div>
      </div>

      {!todos.length && (
        <TypeWritter text="Создайте свой первый список!" speed={100} />
      )}
    </>
  );
};

export default TodoWrapper;
