import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Public Components
import App from './App.jsx';
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import User_ProtectedRoute from './components/User_ProtectedRoute/User_ProtectedRoute.jsx';

// Driver Components
import Driver_Dashboard from './components/Driver_Dashboard/Driver_Dashboard.jsx';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>

      {/* Public routes */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Driver routes */}
      <Route path="/driver" element={<App />}>
        <Route path="dashboard" element={<User_ProtectedRoute> <Driver_Dashboard /> </User_ProtectedRoute>} />
      </Route>
    </>
  )

);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
