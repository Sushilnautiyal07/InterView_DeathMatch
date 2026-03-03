import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, Terminal } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="absolute top-0 left-0 right-0 z-[100] bg-black border-b border-white/5 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* LEFT: LOGO SECTION (Exact as Image) */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          {/* Logo Box with Purple/Pink Border */}
          <div className="relative p-[1.5px] rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/10">
            <div className="bg-black rounded-[10px] size-9 flex items-center justify-center">
              <Terminal className="size-5 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Logo Text - Pure White & Bold */}
          <span className="text-white font-bold text-xl tracking-tight">
            ProctoHire
          </span>
        </Link>

        {/* RIGHT: NAVIGATION LINKS (Button styling preserved) */}
        <div className="flex items-center gap-2">
          <Link
            to="/problems"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2
              ${
                isActive("/problems")
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
          >
            <BookOpenIcon className="size-4" />
            <span className="hidden sm:inline">Problems</span>
          </Link>

          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2
              ${
                isActive("/dashboard")
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
          >
            <LayoutDashboardIcon className="size-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="ml-4 pl-4 border-l border-white/10 flex items-center h-8">
            <UserButton 
               appearance={{
                elements: {
                  avatarBox: "size-8 border border-white/10 hover:border-purple-500/50 transition-all"
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;