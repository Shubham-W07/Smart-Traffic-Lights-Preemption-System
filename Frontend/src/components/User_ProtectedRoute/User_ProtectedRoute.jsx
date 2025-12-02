import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Driver_ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Get user data from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // No user or token → redirect to login
  if (!user || !user.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(user.token);
    // console.log("Decoded JWT:", decoded.email);

    // Check expiration
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem("user");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Validate token identity (optional but good)
    if (decoded.email && decoded.email !== user.email) {
      localStorage.removeItem("user");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Merge decoded info into the existing user object
    const updatedUser = {
      username: decoded.user_name,
      email: decoded.email,
      token: user.token,
      role: decoded.role
    };

    // clear any old data
    localStorage.removeItem("user");

    // Save it back to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("user");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token valid render the protected route
  return children;
};

export default Driver_ProtectedRoute;
