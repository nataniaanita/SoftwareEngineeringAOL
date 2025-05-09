"use client"

import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg w-full absolute">
      <div className="container mx-auto flex justify-between items-center font-bold">
        <h1 className="text-xl font-bold">MediSynth</h1>
        <ul className="flex space-x-8">
          <li>
            <Link to="/database" className="hover:text-gray-300 transition duration-300">Database</Link>
          </li>
          <li>
            <Link to="/" className="hover:text-gray-300 transition duration-300">Upload</Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-gray-300 transition duration-300">Login</Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-gray-300 transition duration-300">Register</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar;