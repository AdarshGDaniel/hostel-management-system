import { Navigate } from "react-router-dom";
import { isStaffOrAdmin } from "../utils/roleGuard";

const ProtectedRoute = ({ children }) => {
  return isStaffOrAdmin() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
