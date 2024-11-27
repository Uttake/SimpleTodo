import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import { fetchTodos } from "@/services/todoServices";
import { AppDispatch } from "@/store";
import { checkUser } from "@/services/authService";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  const checkValidUser = async () => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      const valid = await checkUser(user.id);
      if (valid) {
        localStorage.setItem("history", JSON.stringify([]));
        dispatch(setUser(user));
        dispatch(fetchTodos(user.id));
      } else {
        <Navigate to="/" />;
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    checkValidUser();
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
