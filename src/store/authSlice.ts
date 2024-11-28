import  bcrypt  from 'bcryptjs';
import { supabase } from '@/services/supabaseClient';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface RegisterUserParams {
  username: string;
  password: string;
}

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


export type OAuthProvider = 'google' | 'github' | 'facebook' ;  

export const signInOther = createAsyncThunk<
  OAuthResponse,               
  { type: OAuthProvider },     
  { rejectValue: string }      
>('auth/signInOther', async ({ type }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: type,
      options: {
        redirectTo: 'http://localhost:5173/todo',
      }
    });
  
    if (error) {
      return rejectWithValue(error.message);  
    }

    return data as any;  
  } catch (error) {
    return rejectWithValue('Неизвестная ошибка');
  }
});


export const registerUser = createAsyncThunk<
  User,
  RegisterUserParams,
  { rejectValue: string }
>('auth/register', async ({ username, password }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('users')
    .insert({ username, password_hash: password })
    .select()
    .single();

  if (error) {
    return rejectWithValue(error.message);
  }

  return data as User;
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    {rejectWithValue }
  ) => {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, password_hash')
      .eq('username', username)
      .single();
    if (error || !user) {
      return rejectWithValue('Неверный логин или пароль');
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return rejectWithValue('Неверный логин или пароль');
    }
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
);

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
