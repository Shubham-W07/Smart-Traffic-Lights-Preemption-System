import { useState } from 'react';
import "./Register.css";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';

const Register = () => {
  const [serverError, setServerError] = useState(null);
  const [passwordmismatchError, setPasswordmismatchError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {

    console.log(data);

    setServerError(null);

    setPasswordmismatchError(null);
    if (data.password !== data.confirm_password) {
      setPasswordmismatchError("Password Mismatch");
      throw new Error(null);
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: data.user_name,
          email: data.email,
          password: data.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Server Error');
      }

      console.log(result);
      navigate("/login");
    }
    catch (error) {
      setServerError(error.message);
    }

  }

  return (
    <div className='register'>

      <form onSubmit={handleSubmit(onSubmit)}>
        {serverError && <h4 className="error">{serverError}</h4>}
        <h3>Register Yourself</h3>

        <label>Username</label>
        <input type="text" placeholder="Enter your name" {...register("user_name", { required: "User Name is required" })} />
        {errors.user_name && <p className="error">{errors.user_name.message}</p>}

        <label>Email</label>
        <input type="email" placeholder="Enter your email" {...register("email", { required: "User Name is required" })} />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label>Password</label>
        <input type="password" placeholder="Set your password" {...register("password", { required: "Password is required" })} />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <label>Confrim Password</label>
        <input type="password" placeholder="Set your password" {...register("confirm_password", { required: "Password is required" })} />
        {errors.confirm_password && <p className="error">{errors.confirm_password.message}</p>}
        {passwordmismatchError && <p className="error">{passwordmismatchError}</p>}

        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Registering ..." : "Resiter"}</button>
        <p className='then-register'><NavLink to="/login">Already Register! <span>Login In Here</span></NavLink></p>
      </form>

    </div>
  )
}

export default Register;
