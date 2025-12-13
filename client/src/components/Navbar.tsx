import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HomeIcon, LoginIcon, LogoutIcon, PlusIcon } from "../assets/icons";

type NavbarProps = {
  onOpenAdmin?: () => void;
};

const Navbar = ({ onOpenAdmin }: NavbarProps) => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-indigo-600">
          <HomeIcon />
          Sweet Shop
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link
            to="/"
            className={`rounded-full px-3 py-2 ${pathname === "/" ? "bg-indigo-50 text-indigo-600" : "text-slate-700"}`}
          >
            Home
          </Link>
          {user?.role === "admin" && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 rounded-full bg-rose-500 px-3 py-2 font-medium text-white transition hover:bg-rose-600"
            >
              <PlusIcon />
              Add Sweet
            </button>
          )}
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-slate-700 transition hover:border-rose-400 hover:text-rose-500"
            >
              <LogoutIcon />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-2 font-medium text-white transition hover:bg-indigo-700"
            >
              <LoginIcon />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
