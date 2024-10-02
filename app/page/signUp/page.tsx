"use client";
import { useState } from "react";
import { UserSignUp } from "@/app/services/signup";
import Link from "next/link";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    owner_name: '',
    email: '',
    password: '',
    phone_number: ''
  });
  const [isSignedUp, setIsSignedUp] = useState(false); // Track if signup was successful
  const [errorMessage, setErrorMessage] = useState(""); // Track any signup errors

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await UserSignUp({
        owner_name: formData.owner_name,
        email: formData.email,
        password_hash: formData.password,
        phone_number: formData.phone_number,
      });
      console.log('User signed up successfully:', response.data);
      setIsSignedUp(true); // Set the success state to true
      setFormData({
        owner_name: '',
        email: '',
        password: '',
        phone_number: ''
      }); // Reset form fields
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage("Signup failed, please try again."); // Set error message
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

        {/* Display success message and login button if signed up successfully */}
        {isSignedUp ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">Sign up successful!</p>
            <a
              href="http://localhost:3000/page/login"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Go to Login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner Name</label>
              <input
                type="text"
                name="owner_name"
                placeholder="Owner Name"
                value={formData.owner_name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
            <button className="mt-4">
              <Link
                href="http://localhost:3000"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
              >
                Go Back
              </Link>
            </button>
          </form>
        )}

        {/* Display error message if signup fails */}
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
