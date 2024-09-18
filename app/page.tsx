import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome</h1>
      <div className="flex flex-col gap-4">
        <Link
          href={"/page/signUp"}
          className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          <h1 className="text-xl">Sign Up If You Are New</h1>
        </Link>
        <Link
          href={"/page/login"}
          className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
        >
          <h1 className="text-xl">Login</h1>
        </Link>
      </div>
    </div>
  );
}