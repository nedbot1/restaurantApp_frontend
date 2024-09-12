"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
 const router = useRouter();
  const handleLogin = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/login",
        { username, password }
      );
      localStorage.setItem("accessToken", data.accessToken);
      router.push("/page/dashboard");
    } catch (error: any) {
      if (error.response)
      {
        setError(error.response.data.message)
      }
      else {
      setError("something went wrong")  
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <div className="relative mb-4">
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 pl-12 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-800 placeholder-gray-500"
            type="text"
          />
          <svg
            className="absolute left-3 top-3 h-6 w-6 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 11-8 0 4 4 0 018 0zM12 14l-2 2m4 0l-2-2m0 0v2m0 4h.01"
            />
          </svg>
        </div>
        <div className="relative mb-6">
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-12 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-800 placeholder-gray-500"
          />
          <svg
            className="absolute left-3 top-3 h-6 w-6 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c1.66 0 3-1.34 3-3V7a3 3 0 10-6 0v1c0 1.66 1.34 3 3 3zM7 14h10v6H7v-6z"
            />
          </svg>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
        >
          Login
        </button>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      </div>
      <div>
        <Link href={"/page/home"}>
          go to home
        </Link>
      </div>
    </div>
  );
}
