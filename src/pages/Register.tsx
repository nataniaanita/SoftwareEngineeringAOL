import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage () {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log({ email, username, password });
    // TODO: kirim ke backend pake fetch
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6fff7]">
      <form
        onSubmit={handleRegister}
        
        className="bg-white rounded-3xl shadow-xl px-6 py-8 w-full max-w-sm overflow-hidden transition-all duration-300 transform hover:shadow-2xl"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
          Register
        </h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Username</label>
          <input
            type="text"
            placeholder="ellen"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="ellenbauketek@gmail.com"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#8745b6] hover:bg-[#74437b] text-white py-2 px-4 rounded-2xl text-sm font-medium transition"
        >
          Register
        </button>

        <p className="text-xs text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline font-bold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
