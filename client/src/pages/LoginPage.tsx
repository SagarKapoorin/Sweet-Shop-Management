import axios from 'axios';
import { type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { LockIcon, LoginIcon, MailIcon, RegisterIcon, SmallLoaderIcon } from '../assets/icons';
import { Sparkle, CupcakeIcon, LollipopIcon, DonutPattern } from '../components/Decorations';

const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const errorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string; error?: string };
      return data?.message || data?.error || err.message;
    }
    return err instanceof Error ? err.message : 'Authentication failed';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      toast.error('All fields required');
      return;
    }
    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success('Welcome back');
      } else {
        await register(name, email, password, role);
        toast.success('Account created');
      }
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50 px-4 py-12">
      <DonutPattern />

      <div className="absolute left-10 top-20 opacity-10">
        <CupcakeIcon className="h-32 w-32 text-rose-400" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <LollipopIcon className="h-28 w-28 text-amber-400" />
      </div>

      <Sparkle delay="0s" left="10%" top="15%" />
      <Sparkle delay="1s" left="85%" top="25%" />
      <Sparkle delay="2s" left="15%" top="70%" />
      <Sparkle delay="1.5s" left="90%" top="60%" />

      <div className="relative w-full max-w-md animate-bounce-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-amber-400 shadow-2xl shadow-rose-300/50">
            <LoginIcon />
          </div>
          <h1 className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-4xl font-black text-transparent">
            Sweet Shop
          </h1>
          <p className="mt-2 text-sm font-medium text-stone-600">Delicious Treats Management</p>
        </div>

        <div className="overflow-hidden rounded-3xl border-2 border-stone-200 bg-white shadow-2xl shadow-stone-200/50 transition-all duration-300 hover:shadow-3xl">
          <div className="border-b-2 border-stone-100 bg-gradient-to-r from-amber-50 via-white to-rose-50 px-8 py-6">
            <h2 className="text-2xl font-bold text-stone-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              {mode === 'login'
                ? 'Sign in to access your sweet shop dashboard'
                : 'Join us to manage your delicious treats'}
            </p>
          </div>

          <form className="p-8" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {mode === 'register' && (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                  Email Address
                </label>
                <div className="flex items-center gap-3 rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 transition-all focus-within:border-amber-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-amber-200/50">
                  <MailIcon />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-transparent text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                    Account Type
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                    className="w-full rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 transition-all focus:border-amber-400 focus:bg-white focus:shadow-lg focus:shadow-amber-200/50 focus:outline-none"
                  >
                    <option value="user">User - Browse & Purchase</option>
                    <option value="admin">Admin - Full Management</option>
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 transition-all focus-within:border-amber-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-amber-200/50">
                  <LockIcon />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    required
                    className="w-full bg-transparent text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
                <p className="mt-2 text-xs text-stone-500">Minimum 6 characters required</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rose-300/50 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading && <SmallLoaderIcon />}
                {mode === 'login' ? (
                  <>
                    <LoginIcon />
                    Sign In
                  </>
                ) : (
                  <>
                    <RegisterIcon />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="border-t-2 border-stone-100 bg-stone-50 px-8 py-6 text-center">
            <p className="text-sm text-stone-600">
              {mode === 'login' ? 'New to Sweet Shop? ' : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="font-bold text-rose-600 transition-colors hover:text-amber-600"
              >
                {mode === 'login' ? 'Create an account' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-stone-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
