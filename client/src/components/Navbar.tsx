import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { HomeIcon, LoginIcon, LogoutIcon, PlusIcon } from '../assets/icons';

type NavbarProps = {
  onOpenAdmin?: () => void;
};

const Navbar = ({ onOpenAdmin }: NavbarProps) => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-amber-100/50 bg-gradient-to-r from-white via-amber-50/30 to-rose-50/30 shadow-sm backdrop-blur-xl animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-amber-400 shadow-lg shadow-rose-200/50 transition-all duration-300 group-hover:rotate-12 group-hover:shadow-xl group-hover:shadow-rose-300/50">
              <HomeIcon />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-xl font-bold leading-none text-transparent">
                Sweet Shop
              </span>
              <span className="text-xs font-medium text-stone-500">Delicious Treats</span>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/"
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                pathname === '/'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-200/50 hover:scale-105'
                  : 'text-stone-700 hover:scale-105 hover:bg-gradient-to-r hover:from-stone-100 hover:to-stone-50'
              }`}
            >
              Home
            </Link>
            {user?.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-300/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <PlusIcon />
                <span className="relative hidden sm:inline">Add Sweet</span>
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden flex-col items-end lg:flex">
                  <span className="text-xs font-semibold text-stone-900">{user.name}</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium capitalize text-amber-700">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-xl border-2 border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                >
                  <LogoutIcon />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-200/50 transition-all hover:shadow-xl hover:shadow-rose-300/50"
              >
                <LoginIcon />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col gap-1.5 rounded-lg p-2 transition-colors hover:bg-stone-100 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`h-0.5 w-6 rounded-full bg-stone-700 transition-all ${mobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`h-0.5 w-6 rounded-full bg-stone-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`h-0.5 w-6 rounded-full bg-stone-700 transition-all ${mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-amber-100 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  pathname === '/'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                Home
              </Link>
              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    onOpenAdmin?.();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  <PlusIcon />
                  Add Sweet
                </button>
              )}
              {user ? (
                <>
                  <div className="rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3">
                    <p className="text-sm font-semibold text-stone-900">{user.name}</p>
                    <p className="text-xs font-medium capitalize text-stone-600">{user.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-xl border-2 border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    <LogoutIcon />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  <LoginIcon />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
