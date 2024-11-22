import { task, todo, TodoState } from "@/lib/definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v1 } from "uuid";

const initialState: TodoState = {
  todos: [],
  history: []
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: (create) => ({
        addTodo: create.reducer((state, action : PayloadAction<{title: string}>) => {
            let todo : todo = {
                id: v1(),
                title: action.payload.title,
                tasks: []
            }
            state.todos.push(todo)
        }),
        deleteTodo: create.reducer((state, action: PayloadAction<{id: string}>) => {
            let todo = state.todos.find(el => el.id === action.payload.id);
            if(todo) {
                state.history.push(todo);
                if(state.history.length > 15) {
                    state.history.shift();
                }
                state.todos = state.todos.filter(el => el.id !== action.payload.id);
            }
        }),
        addTask: create.reducer((state, action: PayloadAction<{id: string, todo: string}>) => {
            const todo = state.todos.find((el) => el.id === action.payload.id);
            if (todo) {
              const newTask = {
                id: v1(),
                todo: action.payload.todo,
                completed: false
              };
              todo.tasks.push(newTask); 
            }
        }),
        deleteTask: create.reducer((state, action: PayloadAction<{id: string; taskId: string}>) => {
            const todo = state.todos.find((el) => el.id === action.payload.id);
            if (todo) {
              todo.tasks = todo.tasks.filter((el: task) => el.id !== action.payload.taskId);
            }
        }),
        toggleTask: create.reducer((state, action : PayloadAction<{id: string; taskId: string}>) => {
            const todo = state.todos.find((el) => el.id === action.payload.id);
            if (todo) {
              const task = todo.tasks.find((el) => el.id === action.payload.taskId);
              if (task) {
                task.completed = !task.completed;
              }
            }
        }),
        clearCompleted: create.reducer((state, action : PayloadAction<{id: string}>) => {
            const todo = state.todos.find((el) => el.id === action.payload.id);
            if(todo) {
                todo.tasks = todo.tasks.filter((el: task) => !el.completed)
            }
        }),
        updatedTask: create.reducer((state, action : PayloadAction<{id: string, tasks: task[]}>) => {
          const todo = state.todos.find((el) => el.id === action.payload.id)
          if(todo) {
            todo.tasks = [...action.payload.tasks];
          }
        }),
        updateTodos: create.reducer((state:any, action : PayloadAction<{todos: todo[]}>) => {
          console.log('Updated todos in Redux:', action.payload.todos);
          state.todos = [...action.payload.todos]
        }),
        restoreHistory: create.reducer((state, action : PayloadAction<{id: string}>) => {
          const todo = state.history.find((el) => el.id === action.payload.id);
          if(todo) {
            state.todos.push(todo);
            state.history = state.history.filter((el) => el.id !== action.payload.id);
          }
        }),
        removeHistory: create.reducer((state, action : PayloadAction<{id: string}>) => {
          state.history = state.history.filter((el) => el.id !== action.payload.id);
        })
       
    }),
    selectors: {
        getTodos: (state) => state.todos,
        getTasks: (state: any, id: string) => state.todos.find((el: any) => el.id === id)?.tasks,
        getHistoryTodo: (state) => state.history
    }
            
})

export const {addTodo, deleteTodo, addTask, deleteTask, toggleTask, clearCompleted, updatedTask, updateTodos, restoreHistory, removeHistory} = todosSlice.actions
export const {getTodos, getTasks, getHistoryTodo} = todosSlice.selectors

export default todosSlice.reducer


