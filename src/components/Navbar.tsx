"use client";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("loggedUser");
    setLoggedIn(!!userData);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md text-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              MedSynth AI
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link
                to="/"
                className="font-medium hover:opacity-80 transition text-gray-800"
              >
                Home
              </Link>

              {!loggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-1 rounded-md font-medium transition-all bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 rounded-md font-medium transition-all border border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/generate"
                    className="font-medium hover:opacity-80 transition text-blue-600"
                  >
                    Generate Dataset
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md font-medium transition-all bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-md focus:outline-none text-gray-800"
              onClick={() => console.log("Mobile menu toggle")}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-700"
          >
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
