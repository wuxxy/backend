import { useState } from "react";
import { useAuthRedirect, useAuthStore } from "~/lib/auth";

export default function Login() {
  const [access_key, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, logout, loading, login } = useAuthStore();
  useAuthRedirect(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ access_key });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white font-sans overflow-hidden">
      {/* 🔮 FULLSCREEN SVG BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="blobGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
              <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
            </linearGradient>
            <linearGradient id="blobGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <g transform="translate(1000, 0)">
            <path
              d="M0 351C-43.3 372 -86.6 393.1 -125.3 385.8C-164.1 378.4 -198.3 342.7 -223.9 308.2C-249.6 273.7 -266.8 240.4 -288 209.3C-309.2 178.1 -334.3 149.2 -352.8 114.6C-371.3 80.1 -383.2 40.1 -395 0L0 0Z"
              fill="url(#blobGrad1)"
              opacity="0.35"
            />
          </g>
          <g transform="translate(0, 1000)">
            <path
              d="M0 -390C47 -399.1 94 -408.1 125.3 -385.8C156.7 -363.4 172.3 -309.7 205.1 -282.3C237.9 -255 287.9 -254 317.1 -230.4C346.4 -206.9 354.9 -160.8 365.2 -118.7C375.6 -76.5 387.8 -38.3 400 0L0 0Z"
              fill="url(#blobGrad2)"
              opacity="0.3"
            />
          </g>
        </svg>
      </div>

      {/* 🧊 LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md bg-[#0e0e0e] border-b-2 border-x-2 border-white/10 rounded-t-none rounded-xl shadow-[0_4px_60px_rgba(255,0,130,0.15)] p-8 sm:p-10 backdrop-blur-lg">
        {/* 🔥 Clean Accent Strip */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-500 shadow-[0_0_10px_rgba(244,63,94,0.4)] border-t-2 border-white/10" />

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Secure Login
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Enter your access key to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-white/60 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={access_key}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-md bg-zinc-900 text-white placeholder-white/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${
                  error ? "border-pink-500 ring-pink-500/50" : ""
                }`}
              />
            </div>
            {error && <p className="text-sm text-pink-400 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-pink-600 hover:bg-pink-700 transition text-white font-medium shadow-[0_0_14px_#f43f5e66]"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">
          Need help?{" "}
          <a href="#" className="text-pink-400 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
