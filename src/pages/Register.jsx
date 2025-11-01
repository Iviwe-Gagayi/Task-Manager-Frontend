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
    <div className="min-h-screen grid place-items-center bg-white px-4">
      <form onSubmit={onSubmit} className="w-full h-100 flex flex-col justify-center max-w-sm bg-white p-6 rounded-2xl shadow border-2 border-cyan-500">
        <h1 className="text-2xl font-semibold text-black mb-6">Create account</h1>

        <label className="block text-black text-sm mb-1">Email</label>
        <input
          className="w-full mb-4 rounded-lg bg-slate-100 px-3 py-2 text-black outline-none"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-black text-sm mb-1">Password</label>
        <input
          className="w-full mb-3 rounded-lg bg-slate-100  px-3 py-2 text-black outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

       {err && <div className="mb-3 text-sm text-red-400">{err}</div>}

        <button
          className="cursor-pointer w-full rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-2 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-black text-sm mt-4">
          Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
