import {task, todo, TodoState } from "@/lib/definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v1 } from "uuid";
import { addNewTodo, fetchTodos } from "@/services/todoServices";

const initialState: TodoState = {
  todos: [],
  history: [],
  loading: false,
  error: null
};


const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: (create) => ({
        deleteTodo: create.reducer((state, action: PayloadAction<{id: string}>) => {
            let todo = state.todos.find(el => el.id === action.payload.id);
            if(todo) {
                localStorage.setItem('history', JSON.stringify(state.history));
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
        
          state.todos = [...action.payload.todos]
        }),
        editTodo: create.reducer((state, action: PayloadAction<{id : string, newTitle: string}>) => {
          const todo = state.todos.find(el => el.id === action.payload.id)
          if(todo) {
            todo.title = action.payload.newTitle
          }
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
        }),
        clearHistory: create.reducer((state) => {
          localStorage.setItem('history', JSON.stringify([]));
          state.history = []
        }),
        editTask: create.reducer((state, action: PayloadAction<{id: string; taskId: string; todo: string}>) => {
          const todo = state.todos.find((el) => el.id === action.payload.id);
          if (todo) {
            const task = todo.tasks.find((el) => el.id === action.payload.taskId);
            if (task) {
              task.todo = action.payload.todo;
            }
          }
        })
       
    }),
    selectors: {
        getTodos: (state) => state.todos,
        getTasks: (state: any, id: string) => state.todos.find((el: any) => el.id === id)?.tasks,
        getHistoryTodo: (state) => state.history
    },
    extraReducers: (builder) => {
      builder
      .addCase(addNewTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewTodo.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.todos = [...state.todos, action.payload];
      })
      .addCase(addNewTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка регистрации';
      })
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Ошибка получения данных';
      })
    }
            
})

export const {

  deleteTodo,
  addTask,
  deleteTask,
  toggleTask,
  clearCompleted,
  updatedTask,
  updateTodos,
  restoreHistory,
  removeHistory,
  clearHistory,
  editTask,
  editTodo
} = todosSlice.actions
export const {getTodos, getTasks, getHistoryTodo} = todosSlice.selectors

export default todosSlice.reducer


