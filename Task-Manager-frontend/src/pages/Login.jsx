import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      // login expects { token, user }
      login({ token: data.token, user: data.user });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-900 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-slate-800 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold text-white mb-4">Log in</h1>

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
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-slate-400 text-sm mt-4">
          No account? <Link to="/register" className="text-cyan-400 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
