import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { LockIcon, LoginIcon, MailIcon, RegisterIcon, SmallLoaderIcon } from "../assets/icons";

const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const errorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string; error?: string };
      return data?.message || data?.error || err.message;
    }
    return err instanceof Error ? err.message : "Authentication failed";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "register" && !name)) {
      toast.error("All fields required");
      return;
    }
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Welcome back");
      } else {
        await register(name, email, password, role);
        toast.success("Account created");
      }
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-rose-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">{mode === "login" ? "Login" : "Create account"}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {mode === "login" ? "Access the sweet shop dashboard." : "Manage sweets with your new account."}
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3">
              <MailIcon />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          {mode === "register" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "user" | "admin")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3">
              <LockIcon />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading && <SmallLoaderIcon />}
            {mode === "login" ? (
              <>
                <LoginIcon />
                Login
              </>
            ) : (
              <>
                <RegisterIcon />
                Register
              </>
            )}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-600">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            {mode === "login" ? "Create one" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
