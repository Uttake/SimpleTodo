import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "@/store/authSlice";
import { fetchTodos } from "@/services/todoServices";
import { AppDispatch } from "@/store";
import { checkUser } from "@/services/authService";
import { getHistory } from "@/store/todoSlice";
import { supabase } from "@/services/supabaseClient";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
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
        const { error: dbError } = await supabase.from("users").upsert({
          id,
          username: email,
          password_hash: "OAuth user",
          created_at: new Date(),
        });

        if (dbError) {
          console.error("Error creating/updating user:", dbError);
        }
        dispatch(setUser({ id, username: email }));
        dispatch(fetchTodos(id));
        dispatch(getHistory());
        return;
      }

      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const valid = await checkUser(user.id);
        if (valid) {
          dispatch(setUser(user));
          dispatch(fetchTodos(user.id));
          dispatch(getHistory());
          console.log("User authenticated via localStorage:", user);
        } else {
          localStorage.removeItem("user");
          console.warn("Local user invalid, redirecting to login");
          <Navigate to="/" />;
        }
      } else {
        console.warn("No session or user found");
        <Navigate to="/" />;
      }
    } catch (error) {
      console.error("Error validating user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        window.location.hash = "";
      }
    }
    validateUser();
  }, [dispatch]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
