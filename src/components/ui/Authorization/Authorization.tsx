import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "../input";
import { Button } from "../button";
import GoogleIcon from "../../../assets/svg/google.svg?react";
import GithubIcon from "../../../assets/svg/github.svg?react";
import { useTheme } from "@/Context/ContextTheme";
import { useState } from "react";

import bcrypt from "bcryptjs";
import { getAutError } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "@/store";
import { fetchTodos } from "@/services/todoServices";
import { loginUser, registerUser, signInOther } from "@/services/authService";

const Authorization = () => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const autError = useSelector(getAutError);

  const formSchema = z.object({
    username: z.string().min(2, "Логин не должен быть короче 2 символов"),
    password: z.string().min(5, "Пароль не должен быть короче 5 символов"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const handleRegister = async (
    values: z.infer<typeof formSchema>,
    dispatch: any
  ) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(values.password, salt);
      const action = await dispatch(
        registerUser({ username: values.username, password: hashedPassword })
      );
      const result = unwrapResult(action);

      if (result) {
        localStorage.setItem("user", JSON.stringify(result));
        if (!localStorage.getItem("history")) {
          localStorage.setItem("history", JSON.stringify([]));
        }
        navigate("/todo");
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
    }
  };

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const action = await dispatch(
        loginUser({ username: values.username, password: values.password })
      );
      const result = unwrapResult(action);
      const { id } = result;
      if (result) {
        localStorage.setItem("user", JSON.stringify(result));
        if (!localStorage.getItem("history")) {
          localStorage.setItem("history", JSON.stringify([]));
        }
        navigate("/todo");
        dispatch(fetchTodos(id));
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-center min-h-screen md:px-3 ">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg relative z-50 ">
          <h2 className="text-2xl font-bold text-left mb-2 text-black sm:text-xl">
            {!isLogin ? "Вход в аккаунт" : "Создайте аккаунт"}
          </h2>
          <p className="text-left opacity-60 text-sm mb-4 text-black">
            Заполните данные формы
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {
                if (!isLogin) {
                  handleLogin(form.getValues());
                } else {
                  handleRegister(form.getValues(), dispatch);
                }
              })}
              className="space-y-8 "
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem className=" flex flex-col dark:text-black relative">
                    <FormLabel>Логин</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Логин"
                        className={`mt-1 block ${
                          fieldState.error ? "border-red-500" : ""
                        }`}
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-red-500 text-xs mt-1 absolute -bottom-5">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className=" flex flex-col text-black relative">
                    <FormLabel>Пароль</FormLabel>
                    <button
                      type="button"
                      className="absolute right-0 top-1 h-full px-3 py-2 z-[60]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword((prev) => !prev);
                      }}
                    >
                      {showPassword ? (
                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                    <FormControl>
                      <Input
                        placeholder="Введите пароль"
                        type={showPassword ? "text" : "password"}
                        className={`mt-1 block w-full ${
                          fieldState.error ? "border-red-500" : ""
                        }`}
                        {...field}
                      />
                    </FormControl>

                    {fieldState.error && (
                      <p className="text-red-500 text-xs mt-1 absolute -bottom-5 text-nowrap">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center ">
                <Button
                  type="submit"
                  className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded max-w-[150px] w-full"
                >
                  Войти
                </Button>
              </div>
            </form>
          </Form>
          <div className="flex items-center mt-4 opacity-60 mb-4">
            <div className="flex-grow border-t border-gray-400"></div>
            <div className="mx-4 text-black text-center">или</div>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <div className="flex justify-center gap-6 items-center">
            <Button
              variant="outline"
              type="button"
              className=" basis-1/3"
              onClick={(e) => {
                e.preventDefault();
                dispatch(signInOther({ type: "github" }));
              }}
            >
              <GithubIcon fill={theme === "dark" ? "#fff" : "#000"} /> Github
            </Button>
            {/* <Button
              variant="outline"
              className=" basis-1/3"
              onClick={() => dispatch(signInOther({ type: "google" }))}
            >
              <GoogleIcon fill={theme === "dark" ? "#fff" : "#000"} /> Google
            </Button> */}
          </div>
          <div className="text-sm text-black mt-4 text-center">
            {!isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}
            <button
              className="text-blue-600 ml-2 hover:underline transition-all"
              onClick={() => setIsLogin(!isLogin)}
            >
              {!isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </div>
          {autError && (
            <p className="text-red-500 text-center mt-3">
              {autError.startsWith("duplicate key")
                ? "Пользователь с таким логином уже существует"
                : autError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authorization;
