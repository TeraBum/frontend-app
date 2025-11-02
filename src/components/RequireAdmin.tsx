import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";

interface RequireAdminProps {
  children: JSX.Element;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { initialized, token, role } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== "Administrador") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;

