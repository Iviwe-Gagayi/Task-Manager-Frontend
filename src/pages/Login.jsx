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
      navigate("/home", { replace: true });
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-white px-4">
      <form onSubmit={onSubmit} className="w-full h-100 flex flex-col justify-center max-w-sm bg-white p-6 py-10 rounded-2xl shadow border-2 border-cyan-500">
        <h1 className="text-2xl font-semibold text-black mb-6">Log in</h1>

        <label className="block text-black text-sm mb-1">Email</label>
        <input
          className="w-full mb-4 rounded-lg bg-slate-100  px-3 py-2 text-black outline-none"
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

       {err && <div className="mb-4 text-sm text-red-500">{err}</div>}

        <button
          className=" cursor-pointer w-full rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold py-2 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        

        <p className="text-black text-sm mt-4">
          No account? <Link to="/register" className="text-cyan-400 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
