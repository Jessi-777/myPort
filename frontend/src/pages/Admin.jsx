import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AdminProductManager from "../components/AdminProductManager";
import PrintifySync from "../components/PrintifySync";
import AdminAnalytics from "../components/AdminAnalytics";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export default function Admin() {
  const [token, setToken] = useState(
    () => localStorage.getItem("adminToken") || ""
  );
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  

  // ------------------------------------------------------------
  // API DEBUG
  // ------------------------------------------------------------

  useEffect(() => {
    console.log("🔍 Admin component loaded");
    console.log("🌐 VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log("🔗 API:", API);
    console.log("📍 Login URL:", `${API}/api/admin/login`);
  }, []);

  // ------------------------------------------------------------
  // JWT AUTHENTICATION
  // ------------------------------------------------------------

  const authed = useMemo(() => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);

      if (decoded?.role !== "admin") {
        console.warn("⚠️ Token does not contain admin role");
        return false;
      }

      if (decoded?.exp && decoded.exp * 1000 <= Date.now()) {
        console.warn("⚠️ Admin token has expired");
        localStorage.removeItem("adminToken");
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Invalid admin token:", error);
      localStorage.removeItem("adminToken");
      return false;
    }
  }, [token]);

  // ------------------------------------------------------------
  // LOGIN
  // ------------------------------------------------------------

  async function login(e) {
    e.preventDefault();

    if (!password.trim()) {
      alert("Please enter the admin password.");
      return;
    }

    if (!API) {
      console.error("❌ VITE_API_URL is missing.");
      alert("Admin API URL is not configured.");
      return;
    }

    setLoading(true);

    try {
      const loginUrl = `${API}/api/admin/login`;

      console.log("🔐 Attempting admin login");
      console.log("📍 Login URL:", loginUrl);

      const { data } = await axios.post(
        loginUrl,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (!data?.token) {
        throw new Error(
          "Login succeeded but the server did not return an admin token."
        );
      }

      const decoded = jwtDecode(data.token);

      if (decoded?.role !== "admin") {
        throw new Error(
          "The server returned a token without admin privileges."
        );
      }

      if (decoded?.exp && decoded.exp * 1000 <= Date.now()) {
        throw new Error("The server returned an expired admin token.");
      }

      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setPassword("");

      console.log("✅ Admin login successful");
      console.log("👤 Role:", decoded.role);
    } catch (error) {
      console.error("❌ Admin login failed:", error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Login failed.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------------------------------
  // LOGOUT
  // ------------------------------------------------------------

  function logout() {
    localStorage.removeItem("adminToken");
    setToken("");
    setPassword("");
  }

  // ------------------------------------------------------------
  // LOGIN SCREEN
  // ------------------------------------------------------------

  if (!authed) {
    return (
      <section className="min-h-screen bg-[#08090b] text-white flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#607b93]/10 blur-[120px]" />
          <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#a9d0de]/5 blur-[100px]" />
        </div>

        <div className="relative w-full max-w-md">
          <form
            onSubmit={login}
            className="bg-[#101216] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl"
          >
            {/* Logo / Brand */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[#1b2028] border border-white/10 flex items-center justify-center shadow-lg">
                <span className="text-3xl">🔐</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Admin Portal
              </h1>

              <p className="text-gray-500 text-sm mt-2">
                Secure management dashboard
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-gray-300"
              >
                Administrator Password
              </label>

              <input
                type="password"
                id="admin-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                disabled={loading}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 rounded-xl bg-[#181b21] border border-white/10 text-white placeholder-gray-600 outline-none focus:border-[#a9d0de]/60 focus:ring-2 focus:ring-[#a9d0de]/10 transition disabled:opacity-50"
              />
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3.5 rounded-xl bg-[#607b93] hover:bg-[#6f8da8] text-white font-bold transition-all shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Enter Admin Dashboard"
              )}
            </button>

            <p className="text-center text-xs text-gray-600 mt-6">
              Authorized administrators only
            </p>
          </form>
        </div>
      </section>
    );
  }

  return <AdminPanel token={token} onLogout={logout} />;
}

// ============================================================================
// ADMIN PANEL
// ============================================================================

function AdminPanel({ token, onLogout }) {
  const [tab, setTab] = useState("analytics");
  // const [tab, setTab] = useState("products");
  

  const tabs = [
  {
    id: "analytics",
    label: "Analytics",
    icon: "📊",
    description: "Traffic & sales insights",
  },
  {
    id: "products",
    label: "Products",
    icon: "📦",
    description: "Manage your catalog",
  },
  {
    id: "printify",
    label: "Printify Sync",
    icon: "🖨️",
    description: "Manage Printify products",
  },
];

  return (
    <section className="min-h-screen bg-[#0b0d10] text-white">
      {/* ============================================================
          TOP HEADER
      ============================================================ */}
      <header className="sticky top-0 z-50 bg-[#0b0d10]/95 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[72px] flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#181c23] border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-xl">⚡</span>
              </div>

              <div className="min-w-0">
                <h1 className="font-bold text-white truncate">
                  Admin Dashboard
                </h1>

                <p className="text-[11px] text-gray-500 hidden sm:block">
                  Store Management
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#11151a] border border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-gray-400">
                  Admin Session Active
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">↪</span>
              </button>
            </div>
          </div>

          {/* ==========================================================
              NAVIGATION
          ========================================================== */}
          <nav className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {tabs.map((item) => {
              const active = tab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`relative shrink-0 px-5 sm:px-6 py-4 flex items-center gap-2.5 transition ${
                    active
                      ? "text-[#a9d0de]"
                      : "text-gray-500 hover:text-gray-200"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>

                  <span className="text-sm font-semibold">
                    {item.label}
                  </span>

                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#a9d0de] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}
      {/* ============================================================
    MAIN CONTENT
============================================================ */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {tab === "analytics" && (
          <AdminAnalytics
            token={token}
            onUnauthorized={onLogout}
          />
        )}

        {tab === "products" && (
          <AdminProductManager
            token={token}
            onUnauthorized={onLogout}
          />
        )}

        {tab === "printify" && (
          <PrintifySync
            token={token}
            onUnauthorized={onLogout}
          />
        )}

      </main>
          </section>
        );
      }

