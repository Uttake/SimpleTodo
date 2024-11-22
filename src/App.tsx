import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import AddForm from "./components/ui/AddForm";
import { getHistoryTodo, getTodos, updateTodos } from "./store/todoSlice";
import { addTodo } from "@/store/todoSlice";
import clsx from "clsx";
import { useEffect, useState } from "react";
import HistoryModal from "./components/ui/HistoryModal/HistoryModal";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import Todo from "./components/ui/Todo";

function App() {
  const todos = useSelector(getTodos);
  const history = useSelector(getHistoryTodo);
  const dispatch = useDispatch();
  const [allTodos, setAllTodos] = useState(todos);
  const [historyOpen, setHistoryOpen] = useState(false);

  const onTodoAdd = (title: string) => {
    dispatch(addTodo({ title }));
  };

  const handleDragEnd = ({ active, over }: { active: any; over: any }) => {
    if (active.id !== over?.id) {
      const oldIndex = allTodos.findIndex((todo) => todo.id === active.id);
      const newIndex = allTodos.findIndex((todo) => todo.id === over.id);

      const updatedTodos: any = arrayMove(allTodos, oldIndex, newIndex);

      setAllTodos(updatedTodos);
      dispatch(updateTodos({ todos: updatedTodos }));
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
          "flex flex-col pt-5 relative z-20 max-w-[1440px] my-0 mx-auto items-center"
        )}
      >
        <div className=" mb-5 flex justify-center items-center flex-wrap">
          <div className="max-w-[500px] w-full">
            <AddForm
              btnTitle="Добавить"
              onAdd={onTodoAdd}
              placeholder="Создайте новый список"
            />
          </div>
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
                "flex gap-x-4 gap-y-4 duration-300 transition-all ease-in-out flex-wrap basis-1/3",
                todos.length === 1
                  ? " justify-center"
                  : todos.length === 2
                  ? "justify-between max-w-[1100px]"
                  : "justify-center max-w-full"
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

      <div className="text-white text-lg absolute z-40 right-[5%] top-5">
        <button className="relative z-40" onClick={() => setHistoryOpen(true)}>
          История cписков
        </button>
        <HistoryModal
          isOpen={historyOpen}
          width={300}
          setIsOpen={setHistoryOpen}
          historyData={history}
        />
      </div>
    </>
  );
}

export default App;
