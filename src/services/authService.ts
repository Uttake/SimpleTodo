import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "./supabaseClient"
import  bcrypt  from 'bcryptjs';
import { OAuthResponse, User } from "@/store/authSlice";



interface RegisterUserParams {
  username: string;
  password: string;
}


export const checkUser = async (id: string) => {
  try {
    let { data, error } : { data: any, error: any} = await supabase
    .from('users')
    .select('id, username')
    .eq('id', id)
    .single()
    
    if(!data) {
     throw new Error(error)
    }
   
    return data

  }catch (error) {
    console.log(error)
  }
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
        redirectTo: 'https://simplestodos.netlify.app/todo',
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