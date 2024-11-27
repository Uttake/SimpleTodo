import { configureStore } from "@reduxjs/toolkit";
import todosSlice from "./todoSlice";
import authSlice from "./authSlice";

const store = configureStore({
    reducer:{
        todos: todosSlice,
        auth: authSlice
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store