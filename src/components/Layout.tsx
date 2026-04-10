import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, User, LogOut, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Compass, label: "Explore" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-0 md:pt-16">
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-bottom border-slate-100 z-50 items-center justify-between px-8 soft-shadow">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-accent">
            <span className="font-bold text-lg">I</span>
          </div>
          <span className="font-display font-bold text-xl text-primary">IdeaBisnis AI</span>
        </div>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path ? "text-primary" : "text-slate-500"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut size={18} className="mr-2" /> Logout
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[450px] mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 soft-shadow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-primary scale-110" : "text-slate-400"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <LogOut size={24} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Keluar</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="w-full max-w-[450px] mx-auto px-4 py-8 text-center space-y-4">
        <div className="h-px bg-slate-200 w-full" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          AZKAPRINT – PEMBUATN STEMPEL & PERCETAKAN
        </p>
        <a
          href="https://wa.me/628551994060?text=Assalamualaikum,%20saya%20mau%20bertanya%20tentang%20stempel%20atau%20percetakan"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full font-bold text-sm soft-shadow transition-transform active:scale-95 hover:bg-yellow-400"
        >
          <MessageCircle size={18} />
          Hubungi WhatsApp
        </a>
      </footer>
    </div>
  );
}
