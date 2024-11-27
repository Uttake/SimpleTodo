import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "./supabaseClient";
import { task } from "@/lib/definitions";
import { AppDispatch, RootState } from "@/store";
import { v1 } from "uuid";
import { addTask, deleteTask, deleteTodo, editTask, editTodo, toggleTask } from "@/store/todoSlice";
import { debounce } from "@/lib/utils";

type asyncTodoState = {
    id: string;
    title: string;
    user_id: string;
    tasks: task[];
  }

export const fetchTodos = createAsyncThunk('todos/fetchTodos ', async (id : string, {rejectWithValue}) => {
    try {
     const { data, error } = await supabase.from('todos').select('*').eq('user_id', id).order('position', { ascending: true });;
   
     if (error) {
      throw new Error('Ошибка при получении задач');
     }
   
     return data;
    } catch (error) {
     return rejectWithValue(error);
}
}
)

export const addNewTodo = createAsyncThunk<
  asyncTodoState,
  { title: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'todos/addNewTodo',
  async ({ title }, { getState, rejectWithValue }) => {
    const user = getState().auth.user;
    if (!user) {
      return rejectWithValue('Пользователь не авторизован');
    }

    try {
      const id = v1();

      const { data: maxPositionData, error: positionError } = await supabase
        .from('todos')
        .select('position')
        .eq('user_id', user.id)
        .order('position', { ascending: false })
        .limit(1)
        .single();

      if (positionError && positionError.code !== 'PGRST116') {
        throw new Error('Ошибка при определении позиции');
      }

      const maxPosition = maxPositionData?.position || 0;

      const newTodo = {
        id,
        title,
        user_id: user.id,
        tasks: [],
        position: maxPosition + 1, 
      };

      const { error } = await supabase.from('todos').insert(newTodo);

      if (error) {
        throw new Error('Ошибка при добавлении задачи');
      }

      return newTodo;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при добавлении задачи');
    }
  }
);


export const removeTodo = createAsyncThunk<
  { id: string, user_id: string }, 
  { id: string; user_id: string },  
  { rejectValue: string } 
>(
  'todos/removeTodo',
  async ({ id, user_id }, { rejectWithValue, dispatch }) => {
   try {
    const { error } = await supabase.from('todos').delete().eq('id', id).eq('user_id', user_id);

    if (error) {
      throw new Error('Ошибка при удалении задачи'); 
    }

    dispatch(deleteTodo({ id }));

    return { id, user_id };
   } catch (error: any) {
    return rejectWithValue(error);
   }
  }
);

export const updateTodoTitle = createAsyncThunk<
  {title: string, id: string, user_id: string }, 
  {title: string, id: string; user_id: string },  
  { rejectValue: string } 
>(
  'todos/updateTodoTitle',
  async ({title, id, user_id }, { rejectWithValue, dispatch }) => {
   try {
      const { data, error } = await supabase
      .from('todos')
      .update({ title})
      .eq('id', id)
      .eq('user_id', user_id)
      .select()

      console.log(data)

      dispatch(editTodo({ id, newTitle: title }));
      if(error) {
        throw new Error('Ошибка при обновлении задачи');
      }
      return {title, id, user_id};
   } catch (error: any) {
    return rejectWithValue(error);
   }
  }
);


export const addNewTask = createAsyncThunk<
  task,
  { todoId: string; title: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'todos/addNewTask',
  async ({ title, todoId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const stateTasks = getState().todos.todos.find((todo) => todo.id === todoId)?.tasks || [];

      const id = v1();
      const newTask: task = {
        id,
        todo: title,
        completed: false,
        position: stateTasks.length + 1, 
      };

      const updatedTasks = [
        ...stateTasks.map((task: task, index: number) => ({
          ...task,
          position: index + 1,
        })),
        newTask, 
      ];

      const { error: updateError } = await supabase
        .from('todos')
        .update({ tasks: updatedTasks }) 
        .eq('id', todoId); 

      if (updateError) {
        throw new Error(updateError.message); 
      }
      dispatch(addTask({ id: todoId, todo: title }));
      return newTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Неизвестная ошибка');
    }
  }
);




export const removeTask = createAsyncThunk<
  void,
  { todoId: string; id: string}, 
  {state:RootState;  dispatch: AppDispatch; rejectValue: string }
>(
  'todos/removeTask',
  async ({ todoId, id }, {getState, dispatch, rejectWithValue }) => {
    try {
        const stateTasks = getState().todos.todos.find((todo) => todo.id === todoId)?.tasks;

        let updatedTasks = stateTasks?.filter((task : any) => task.id !== id);
        let { error: updateError } = await supabase
          .from('todos')
          .update({ tasks: updatedTasks })
          .eq('id', todoId);
      
        if (updateError) throw new Error(updateError.message);
      dispatch(deleteTask({ id: todoId, taskId: id }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Неизвестная ошибка');
    }
  }
);

export const toggleTaskCompleted = createAsyncThunk<
  void,
  { todoId: string; id: string}, 
  {state: RootState;  dispatch: AppDispatch; rejectValue: string }
>(
  'todos/toggleTaskCompleted',
  async ({ todoId, id }, { getState, dispatch, rejectWithValue }) => {
    try {
      const stateTasks = getState().todos.todos.find((todo) => todo.id === todoId)?.tasks;
        let updatedTasks = stateTasks?.map((task : any) => {
          if (task.id === id) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        let { error: updateError } = await supabase
          .from('todos')
          .update({ tasks: updatedTasks })
          .eq('id', todoId);
      
        if (updateError) throw new Error(updateError.message);

      dispatch(toggleTask({ id: todoId, taskId: id }));
   
    } catch (error: any) {
      return rejectWithValue(error.message || 'Неизвестная ошибка');
    }
});

export const updateTaskTitle = createAsyncThunk<
  void,
  { todoId: string; id: string, newTitle: string}, 
  {state: RootState;  dispatch: AppDispatch; rejectValue: string }
>(
  'todos/updateTaskTitle',
  async ({ todoId, id, newTitle }, {getState, dispatch, rejectWithValue }) => {
    try {
      const stateTasks = getState().todos.todos.find((todo) => todo.id === todoId)?.tasks;
        let updatedTasks = stateTasks?.map((task : any) => {
          if (task.id === id) {
            return { ...task, todo: newTitle };
          }
          return task;
        });
        let { error: updateError } = await supabase
          .from('todos')
          .update({ tasks: updatedTasks })
          .eq('id', todoId);
      
        if (updateError) throw new Error(updateError.message);

      dispatch(editTask({ id: todoId, taskId: id, todo: newTitle }));
    
    } catch (error: any) {
      return rejectWithValue(error.message || 'Неизвестная ошибка');
    }
});

export const updateTodosOrder = createAsyncThunk<
  void, 
  { todos: { id: string; position: number }[] },
  { rejectValue: string } 
>(
  'todos/updateOrder',
  async ({ todos }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('todos')
        .upsert(todos, { onConflict: 'id' }); 

      if (error) {
        throw new Error('Ошибка при обновлении порядка задач');
      }
      
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTaskOrder = createAsyncThunk<
  void,
  { tasks: task[]; todoId: string },
  { state: RootState; rejectValue: string }
>(
  'tasks/updateOrder',
  async ({ tasks, todoId }, { getState, rejectWithValue }) => {

    try {
      const stateTasks = getState().todos.todos.find((todo) => todo.id === todoId)?.tasks;
      const existingTasks: task[] = stateTasks || [];

      const updatedTasks = existingTasks.map((task) => {
        const updatedTask = tasks.find((t) => t.id === task.id);
        return updatedTask ? { ...task, position: updatedTask.position } : task;
      });
      
      updatedTasks.sort((a, b) => (a.position || 0) - (b.position || 0));

      const { error: updateError } = await supabase
        .from('todos')
        .update({ tasks: updatedTasks })
        .eq('id', todoId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Неизвестная ошибка');
    }
  }
);

