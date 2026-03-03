import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Power,
  User,
} from "lucide-react";
import { useState, useEffect } from "react"; 
import AuthModal from "../components/AuthModal"; // Import the new modal

// --- DUMMY AUTH CONSTANTS ---
const AUTH_KEY = 'shieldEyeSession';

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/live", label: "Live Monitor", icon: Activity },
  { to: "/logs", label: "Threat Logs", icon: FileText },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function MainLayout() {
  const location = useLocation();
  const [isProtected, setIsProtected] = useState(true);

  // --- DUMMY AUTH STATE MANAGEMENT ---
  // State holds the user's ID/Email if logged in, or null if logged out.
  const [currentUser, setCurrentUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on initial load (Simulates persistence)
    useEffect(() => {
    const session = localStorage.getItem(AUTH_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setCurrentUser(parsed); // { email, token }
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setIsLoading(false);
  }, []);


  // Handler passed to AuthModal to log in the user
  const handleLoginSuccess = ({ email, token }) => {
    const sessionData = { email, token };
    localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
    setCurrentUser(sessionData);
  };


  // --- LOGOUT HANDLER (Simulates persistence removal) ---
  const handleSignOut = () => {
    localStorage.removeItem(AUTH_KEY);
    setCurrentUser(null);
    console.log("User signed out successfully.");
  };

  // --- CONDITIONAL RENDERING ---
  if (isLoading) {
    // Basic Loading Screen (matches dark theme)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <p className="text-sm">Loading security services...</p>
        </div>
      </div>
    );
  }

  // Enforce Login: Show AuthModal if user is not authenticated
  if (!currentUser) {
    // Pass the success handler to the modal
    return <AuthModal handleLoginSuccess={handleLoginSuccess} />;
  }

  // --- RENDER MAIN LAYOUT IF AUTHENTICATED ---
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-32 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#020617_1px,transparent_0)] bg-[length:26px_26px] opacity-[0.22]" />
      </div>

      <div className="relative z-10 flex h-full">
        {/* SIDEBAR */}
        <aside className="flex h-full w-64 flex-col border-r border-slate-800/70 bg-slate-950/90/70 backdrop-blur-xl">
          {/* Logo */}
          <div className="border-b border-slate-800/70 px-5 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-indigo-400">
                    <Shield className="h-5 w-5 text-slate-950" />
                  </div>
                </div>
                <div className="pointer-events-none absolute -inset-[1px] rounded-2xl border border-cyan-300/60 opacity-70 blur-[2px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[20px] font-extrabold uppercase tracking-[0.1em] leading-none bg-gradient-to-r from-slate-50 via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  ShieldEye
                </span>
                <span className="font-sans mt-1 text-[12px] font-bold uppercase tracking-[0.12em] text-cyan-400">
                  AI Intrusion Monitor
                </span>
              </div>
            </div>
          </div>

          {/* Small status row */}
          <div className="border-b border-slate-800/70 px-5 py-3 text-[12px] font-mono-custom">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="uppercase tracking-[0.1em] font-bold font-sans text-emerald-300">
                  Live
                </span>
              </div>
              <span className="text-[12px] tracking-[0.1em] font-sans uppercase font-bold text-cyan-500">
                v1.0.0 · Local
              </span>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              const active =
                location.pathname === item.to ||
                (item.to !== "/" && location.pathname.startsWith(item.to));

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition-all duration-200 ${
                    active
                      ? "bg-slate-900/90 border border-cyan-400/80 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                      : "border border-transparent hover:border-slate-700 hover:bg-slate-900/70"
                  }`}
                >
                  {/* Left pill indicator */}
                  <span
                    className={`absolute left-0 top-1/2 h-[70%] w-[3px] -translate-y-1/2 rounded-full transition-opacity duration-200 ${
                      active
                        ? "bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)] opacity-100"
                        : "bg-slate-700 opacity-0 group-hover:opacity-70"
                    }`}
                  />
                  {/* Icon circle */}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-cyan-100/90 transition-all duration-200 ${
                      active
                        ? "border-cyan-300 bg-cyan-500/15"
                        : "border-slate-700 bg-slate-900 group-hover:border-cyan-300 group-hover:bg-cyan-500/10"
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 transition-transform duration-200 ${
                        active ? "scale-110" : "group-hover:scale-105"
                      }`}
                    />
                  </div>
                  {/* Label */}
                  <div className="flex flex-col">
                    <span
                      className={`font-extrabold uppercase tracking-[0.1em] ${
                        active
                          ? "text-slate-50"
                          : "text-slate-300 group-hover:text-slate-50"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[12px] font-bold text-cyan-300 tracking-[0.08em]">
                      {item.label === "Dashboard" && "Overview"}
                      {item.label === "Live Monitor" && "Packets & map"}
                      {item.label === "Threat Logs" && "Threat history"}
                      {item.label === "Reports" && "Analytics"}
                      {item.label === "Settings" && "Preferences"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom compact card (User Profile Button) */}
          <div className="border-t border-slate-800/70 px-4 pb-4 pt-3 flex justify-center">
            {/* USER PROFILE BUTTON */}
            <button className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3 text-slate-300
                transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-cyan-500/20">
                <User className="h-5 w-5 transition-colors duration-300 group-hover:text-cyan-300" />
                <span className="font-semibold uppercase tracking-widest text-xs">User Profile</span>
            </button>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <div className="flex h-full flex-1 flex-col">
          {/* HEADER (Taller + bigger fonts) */}
          <header className="flex h-20 items-center justify-between border-b border-slate-800/70 bg-slate-950/85 px-6 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.9)]">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
                </span>
                <span className="font-sans text-[14px] uppercase tracking-[0.1em] font-bold text-slate-400">
                  Real-time Intrusion Detection
                </span>
              </div>
              <p className="text-[15px] text-slate-300 font-bold">
                Monitoring{" "}
                <span className="font-bold font-sans text-sky-400">
                  local traffic & anomalies
                </span>{" "}
                with AI-based threat scoring and defence rules.
              </p>
            </div>

            {/* HEADER RIGHT CONTROLS (Protection Status + Sign Out Button) */}
            <div className="flex items-center gap-4">
                {/* 1. Protection Status Button (Existing Logic) */}
                <div
                    onClick={() => setIsProtected(!isProtected)}
                    className={`group relative flex cursor-pointer items-center gap-3 rounded-xl 
                        px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-300 
                        ${
                            isProtected
                                ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 hover:shadow-lg hover:shadow-emerald-500/40"
                                : "bg-red-500/20 border border-red-400/50 text-red-200 hover:shadow-lg hover:shadow-red-500/40"
                        }`}
                >
                    <div className="relative flex h-3 w-3">
                        <span
                            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                                isProtected
                                    ? "bg-emerald-400 opacity-70"
                                    : "bg-red-400 opacity-70"
                            }`}
                        />
                        <span
                            className={`relative inline-flex h-3 w-3 rounded-full ${
                                isProtected ? "bg-emerald-300" : "bg-red-300"
                            }`}
                        />
                    </div>
                    <Shield className="h-5 w-5" />
                    <span>
                        {isProtected ? "Protection Active" : "Protection Off"}
                    </span>
                    <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-[780ms] ease-out group-hover:translate-x-[130%] group-hover:opacity-100" />
                </div>

                {/* 2. Sign Out Button (LOGOUT HANDLER INTEGRATED) */}
                <button
                    onClick={handleSignOut}
                    className="group relative flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-300
                        transition-all duration-300 hover:border-red-500/50 hover:bg-red-900/20 hover:text-red-300 hover:shadow-xl hover:shadow-red-500/20"
                >
                    <Power className="h-4 w-4 transition-colors duration-300 group-hover:text-red-400" />
                    <span>Sign Out</span>
                    {/* Decorative Shimmer */}
                    <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[120%] group-hover:opacity-100" />
                </button>
            </div>
          </header>

          {/* CONTENT */}
          <main className="custom-scrollbar flex-1 overflow-auto px-4 pb-5 pt-4 sm:px-6 sm:pt-5">
            <div className="min-h-full w-full rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-[0_0_40px_rgba(15,23,42,0.9)] sm:p-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <style>{`
        :root {
          --font-display: "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          --font-mono-custom: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }

        .font-display {
          font-family: var(--font-display);
        }

        .font-mono-custom {
          font-family: var(--font-mono-custom);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            rgba(56, 189, 248, 0.85),
            rgba(15, 23, 42, 1)
          );
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            to bottom,
            rgba(125, 211, 252, 1),
            rgba(15, 23, 42, 1)
          );
        }
      `}</style>
    </div>
  );
}