import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Todo from "./Todo";
import { todo } from "@/lib/definitions";

const SortableTodos = (todo: todo) => {
  const { id } = todo;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Todo {...todo} />
    </div>
  );
};

export default SortableTodos;
