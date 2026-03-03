import { useState } from "react";
import { Mail, Lock, LogIn, UserPlus, Shield, Power, Info } from "lucide-react";

export default function AuthModal({ handleLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const API_BASE_URL = "http://localhost:5000/api";

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");

    setTimeout(() => {
      setLoading(false);
      setInfoMessage(
        "A password reset link has been simulated. Check 'test@shield.com' for instructions."
      );
      setEmail("");
      setTimeout(() => setInfoMessage(""), 6000);
    }, 800);
  };

  const handleAuthAction = async () => {
    if (!validateForm()) return;

    if (!isLogin && password.length < 6) {
      setError("Password must be at least 6 characters long for registration.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Authentication failed.");
        return;
      }

      // Save token + email
      localStorage.setItem("shieldeye_token", data.token);
      localStorage.setItem("shieldeye_email", data.user.email);

      // Tell MainLayout user is logged in
      handleLoginSuccess({
        email: data.user.email,
        token: data.token,
      });

    } catch (err) {
      console.error("Auth error:", err);
      setError("Unable to reach ShieldEye backend. Check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  const title = isLogin ? "Sign In" : "Register";
  const actionButtonText = isLogin ? "Sign In" : "Create Account";
  const ActionIcon = isLogin ? LogIn : UserPlus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm font-sans">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center items-start p-16 relative overflow-hidden bg-slate-900/50 border-r border-slate-800/80">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-transparent"></div>
          <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl opacity-50 -translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-indigo-400">
                  <Shield className="h-5 w-5 text-slate-950" />
                </div>
              </div>
              <span className="text-[28px] font-extrabold uppercase tracking-[0.15em] bg-gradient-to-r from-slate-50 via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                ShieldEye
              </span>
            </div>

            <h1 className="text-5xl font-extrabold text-white leading-tight">
              AI-Powered <br />
              Intrusion <span className="text-cyan-400">Defense.</span>
            </h1>

            <p className="text-m text-gray-400 max-w-sm border-l-4 font-semibold border-cyan-500 pl-4">
              Monitor, Analyze, and Predict threats in real-time using AI.
              Secure your perimeter with intelligence.
            </p>

            <div className="flex items-center gap-2 pt-4">
              <Power className="w-6 h-6 text-emerald-400 animate-pulse" />
              <span className="text-m font-mono font-semibold text-emerald-300 uppercase">
                System Operational: Ready for access
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="flex items-center justify-center p-6 lg:p-10">
          <div
            className="
              bg-gradient-to-br from-[#12181b] to-[#0c0f13]
              py-8 px-7 rounded-2xl border border-cyan-500/20
              w-full max-w-sm space-y-6 animate-fadeInUp shadow-lg shadow-cyan-500/10
            "
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-cyan-400 text-center">
                {title}
              </h2>
              <p className="text-sm font-semibold text-gray-500 text-center pb-3 border-b border-slate-800/60">
                Access the ShieldEye console
              </p>

              <div className="flex bg-slate-900/50 rounded-xl p-1 border-slate-700/60 shadow-inner my-4">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isLogin
                      ? "bg-cyan-600/40 text-white shadow-lg"
                      : "text-gray-400 hover:text-cyan-300 hover:bg-slate-800/50"
                  }`}
                  disabled={loading}
                >
                  <LogIn className="inline-block w-4 h-4 mr-1.5" /> Sign In
                </button>

                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    !isLogin
                      ? "bg-cyan-600/40 text-white shadow-lg"
                      : "text-gray-400 hover:text-cyan-300 hover:bg-slate-800/50"
                  }`}
                  disabled={loading}
                >
                  <UserPlus className="inline-block w-4 h-4 mr-1.5" /> Register
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="p-2.5 text-xs rounded-lg bg-red-900/40 text-red-300 border border-red-500/30 flex items-center gap-2 animate-shake">
                <Info className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* INFO */}
            {infoMessage && (
              <div className="p-2.5 text-xs rounded-lg bg-blue-900/40 text-blue-300 border border-blue-500/30 flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[14px] text-gray-400 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0f1a] border border-slate-700 text-sm text-white pl-11 pr-4 py-2.5 rounded-xl
                  outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 shadow-inner"
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-[14px] text-gray-400 font-medium flex justify-between">
                Password
                {isLogin && (
                  <button
                    onClick={handleForgotPassword}
                    className="text-[12px] text-gray-500 hover:text-cyan-400 transition"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                )}
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0f1a] border border-slate-700 text-sm text-white pl-11 pr-4 py-2.5 rounded-xl
                  outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 shadow-inner"
                  disabled={loading}
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleAuthAction}
              className="group relative w-full flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 
                px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200
                shadow-md shadow-cyan-500/20 transition-all duration-300
                hover:bg-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50 overflow-hidden"
              disabled={loading}
            >
              <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[120%] group-hover:opacity-100" />

              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              ) : (
                <ActionIcon className="h-4 w-4" />
              )}

              <span className="text-[12px]">{loading ? "Processing..." : actionButtonText}</span>
            </button>

            {/* TOGGLE */}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-[14px] font-semibold text-gray-500 hover:text-cyan-400 transition mt-1"
              disabled={loading}
            >
              {isLogin
                ? "Need an account? Register here."
                : "Already have an account? Sign in."}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out 1;
        }
      `}</style>
    </div>
  );
}
