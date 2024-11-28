import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "@/store/authSlice";
import { fetchTodos } from "@/services/todoServices";
import { AppDispatch } from "@/store";
import { checkUser } from "@/services/authService";
import { getHistory } from "@/store/todoSlice";
import { supabase } from "@/services/supabaseClient";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useSelector(getUser);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  const validateUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      }

      if (data?.session?.user) {
        const { id, email } = data.session.user;
        dispatch(setUser({ id, username: email }));
        dispatch(fetchTodos(id));
        dispatch(getHistory());
        console.log("Authenticated via Supabase:", id, email);
      } else {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const valid = await checkUser(user.id);
          if (valid) {
            dispatch(setUser(user));
            dispatch(fetchTodos(user.id));
            dispatch(getHistory());
          } else {
            localStorage.removeItem("user");
          }
        }
      }
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        window.location.hash = "";
      }
    }
    validateUser();
  }, [dispatch]);

  if (loading) {
    return <h1>Добро пожаловать</h1>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
