import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../../redux/user/userSlice";
import axios from "axios";
import { toast } from "react-toastify";

// PasswordInput component with show/hide functionality
const PasswordInput = ({ value, onChange, placeholder, className }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} pr-12`} // Extra padding for the icon
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-4 flex items-center text-gray-600 focus:outline-none"
      >
        {showPassword ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.052 10.052 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10a9.98 9.98 0 01-4.125 8.025M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3l18 18M4.22 4.22a9.992 9.992 0 00-1.562 1.456A9.982 9.982 0 002 10c1.816 3.272 5.13 6 10 6 1.34 0 2.608-.243 3.772-.685M22 22a10.056 10.056 0 01-1.456 1.562M16.828 16.828A9.982 9.982 0 0019 10c-1.816-3.272-5.13-6-10-6-1.34 0-2.608.243-3.772.685M22 22l-18-18"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      dispatch(signInStart());

      const res = await axios.post(
        "http://localhost:3000/api/auth/signin",
        { email, password },
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        dispatch(signInFailure(res.data.message));
        return;
      }

      toast.success("Login successful");
      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700">
      <div className="bg-white rounded-[3rem] shadow-2xl p-10 max-w-md w-full space-y-8 transform transition-all hover:scale-105 duration-300 ease-in-out">
        <form onSubmit={handleLogin} className="space-y-6">
          <h2 className="text-5xl font-extrabold text-gray-800 text-center">
            NOTES
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Log in to continue
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 border border-gray-200 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300"
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-6 py-4 border border-gray-200 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-3 rounded-full shadow-lg hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-500 transition duration-300 transform hover:scale-105"
          >
            LOGIN
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-700 font-medium transition duration-300"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
