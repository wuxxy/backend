import { useSetAtom } from "jotai";
import { useState } from "preact/hooks";
import { authAtom } from "../atoms/auth";

export default function Login() {
  const [password, setPassword] = useState("");
  const auth = useSetAtom(authAtom)
  const login = async (e: any) => {
    e.preventDefault();
    const check_password = await fetch(`http://localhost:5000/check_password?password=${password}`);
    if (check_password.ok) {
      auth(password);
      localStorage.setItem("backman_pass", password);
    }
  }
  return (
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 class="text-2xl font-semibold mb-6 text-center text-white">
          Admin Login
        </h1>
        <form class="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.currentTarget.value)}
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="button"
            onClick={login}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
