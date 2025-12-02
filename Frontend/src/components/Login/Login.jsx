import { useState, useEffect } from 'react';
import "./Login.css";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';

const Login = () => {
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);

      if (user.role == "driver") {
        navigate(`/driver/dashboard`);
      }
      else if (user.role == "hospital") {
        navigate(`/hospital/dashboard`);
      }
    }
  }, []);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {

    console.log(data);
    setServerError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Server Error');
      }

      console.log(result);
      localStorage.setItem("user", JSON.stringify(result));

      navigate(`/driver/dashboard`);
    }
    catch (error) {
      setServerError(error.message);
    }

  }

  return (
    <div className='login'>

      <div className="background"><div className="shape"></div><div className="shape"></div></div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {serverError && <h4 className="error">{serverError}</h4>}
        <h3>Login Here</h3>

        <label>Email</label>
        <input type="email" placeholder="Enter your name" {...register("email", { required: "User Name is required" })} />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label>Password</label>
        <input type="password" placeholder="Set your password" {...register("password", { required: "Password is required" })} />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Log In"}</button>
        <p className='then-login'><NavLink to="/register">Don't Have Account! <span>Register Youself</span></NavLink></p>
      </form>

    </div>
  )
}

export default Login;
