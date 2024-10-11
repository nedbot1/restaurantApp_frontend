
"use client";
import { UserLogin } from "@/app/services/login";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LoginResponse } from "@/app/type/login";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userToken, setUserToken] = useState<LoginResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await UserLogin({ email, password });
      const accountId = response.account.id;
      localStorage.setItem("accountID", accountId);
      setUserToken(response);
      setError(null);
      router.push("/page/owner");
    } catch (error) {
      console.error(error);
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="">
    <div className="flex bg-[#D9D9D9]/35 rounded-3xl items-center px-14 h-[47rem] m-14 gap-14 ">
      <div className="absolute top-7 left-14">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="mb-6 ">
        <img className="h-16 mb-4" src="/logo.png" alt="Logo" />
        <h1>
          Create an{" "}
          <a className="text-[#9C1F1F] font-medium text-2xl">online menu</a> for
          <br /> your restaurant.
          <br /> Print a <a className="font-bold text-2xl">QR code</a> that your{" "}
          <br />
          customers
          <br /> can scan to view the menu
        </h1>
      </div>
      <div className="flex h-screen items-center w-2/4 ">
        <div className="max-w-md w-full p-6 bg-white rounded-2xl border-black border-[3px] shadow-lg flex flex-col justify-center items-center">
          {/* Login Title */}
          <h2 className="text-4xl font-bold text-center text-black mb-4 relative border-b-[#F7D109] border-b-2">
            LOGIN
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5"></span>
          </h2>
          {/* Email Input with Icon */}
          <div className="relative w-full mb-6">
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full py-3 text-xl border-b-2 border-black text-gray-800 font-normal"
              type="email"
            />
            <svg
              className="absolute right-3 top-3 h-6 w-6 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 8l-8 5-8-5V6l8 5 8-5M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
            </svg>
          </div>

          {/* Password Input with Icon */}
          <div className="relative w-full mb-6">
            <svg
              className="absolute right-3 top-3 h-6 w-6 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1t3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm6-5q.825 0 1.413-.587T14 15t-.587-1.412T12 13t-1.412.588T10 15t.588 1.413T12 17M9 8h6V6q0-1.25-.875-2.125T12 3t-2.125.875T9 6z" />
            </svg>
            <input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full py-3 text-xl border-b-2 border-black text-gray-800 font-normal"
            />
          </div>
          {/* Forgot Password Link */}
          <div className="w-full text-left mb-6">
            <a href="#" className="text-sm text-gray-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-[#006C67] hover:bg-[#005e5a] text-white text-xl font-medium py-3 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 mb-6"
          >
            Log In
          </button>

          {/* Error Message */}
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          {/* Success Message */}
          {userToken && (
            <div className="mt-4 text-center">
              <p className="text-lg font-medium text-green-600">
                Login successful!
              </p>
              <p>Welcome, {userToken.account.owner_name}</p>
              <p>Your token: {userToken.token}</p>
            </div>
          )}

          {/* Create an Account Link */}
          <div className="mt-6">
            <Link
              href="/page/home"
              className="text-lg text-black font-light border-b-2 border-black"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}