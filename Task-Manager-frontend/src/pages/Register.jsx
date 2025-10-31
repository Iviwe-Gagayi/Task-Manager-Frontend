// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // 1) register
      await api("/auth/register", { method: "POST", body: { email, password } });

      // 2) then immediately login to get the token
      const data = await api("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // login stores token + user in context/localStorage
      login({ token: data.token, user: data.user });

      // redirect to protected dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErr(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-900 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-slate-800 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold text-white mb-4">Create account</h1>
        {err && <div className="mb-3 text-sm text-red-400">{err}</div>}

        <label className="block text-slate-300 text-sm mb-1">Email</label>
        <input
          className="w-full mb-3 rounded-lg bg-slate-700 px-3 py-2 text-white outline-none"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-slate-300 text-sm mb-1">Password</label>
        <input
          className="w-full mb-4 rounded-lg bg-slate-700 px-3 py-2 text-white outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-2 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-slate-400 text-sm mt-4">
          Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
