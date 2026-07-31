import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminTkn");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtectedRoute;
