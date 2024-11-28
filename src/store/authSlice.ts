
import { loginUser, registerUser, signInOther } from '@/services/authService';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email?: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};


export interface OAuthResponse {
  user: {
    id: string;
    email: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
}



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    setUser: create.reducer((state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }),
    logout: create.reducer((state) => {
      localStorage.removeItem('user');
      state.user = null;
    }),
  }),
  selectors: {
    getUser: (state) => state.user,
    getAutError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Ошибка входа';
      })
      .addCase(signInOther.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.user.id,
          email: action.payload.user.email,
        };
        state.error = null;
      })
      .addCase(signInOther.rejected, (state, action) => {
        state.error = action.payload || 'Неизвестная ошибка';
      });
  },
});


export const {getUser, getAutError} = authSlice.selectors
export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
