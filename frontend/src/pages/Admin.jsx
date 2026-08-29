import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AdminProductManager from "../components/AdminProductManager";
import PrintifySync from "../components/PrintifySync";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export default function Admin() {
  const [token, setToken] = useState(
    () => localStorage.getItem("adminToken") || ""
  );
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Debug API configuration
  useEffect(() => {
    console.log("🔍 Admin component loaded");
    console.log("🌐 VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log("🔗 API:", API);
    console.log("📍 Login URL:", `${API}/api/admin/login`);
  }, []);

  // Validate JWT
  const authed = useMemo(() => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);

      // Make sure this is actually an admin token
      if (decoded?.role !== "admin") {
        console.warn("⚠️ Token does not contain admin role");
        return false;
      }

      // Check expiration
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
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

  async function login(e) {
    e.preventDefault();

    if (!password.trim()) {
      alert("Please enter the admin password.");
      return;
    }

    if (!API) {
      console.error("❌ VITE_API_URL is missing.");
      alert("API URL is not configured.");
      return;
    }

    setLoading(true);

    try {
      const loginUrl = `${API}/api/admin/login`;

      console.log("🔐 Attempting admin login");
      console.log("🌐 API:", API);
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
        throw new Error("Login succeeded but no admin token was returned.");
      }

      // Verify the token before saving it
      const decoded = jwtDecode(data.token);

      if (decoded?.role !== "admin") {
        throw new Error("The server returned a token without admin privileges.");
      }

      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setPassword("");

      console.log("✅ Admin login successful");
      console.log("👤 Role:", decoded.role);
    } catch (error) {
      console.error("❌ Admin login failed:", error);

      console.error("Message:", error.message);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

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

  function logout() {
    localStorage.removeItem("adminToken");
    setToken("");
    setPassword("");
  }

  // Login screen
  if (!authed) {
    return (
      <section className="min-h-screen bg-[#1f2227] flex items-center justify-center px-4">
        <form
          onSubmit={login}
          className="bg-gray-900 p-8 rounded-xl space-y-5 w-full max-w-sm shadow-2xl border border-gray-800"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              Admin Login
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Enter your administrator password.
            </p>
          </div>

          <input
            type="password"
            id="admin-password"
            name="password"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:border-[#a9d0de] transition"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-[#3c4664] text-white rounded-lg hover:bg-[#373f63] disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    );
  }

  return <AdminPanel token={token} onLogout={logout} />;
}

function AdminPanel({ token, onLogout }) {
  const [tab, setTab] = useState("products");

  return (
    <section className="min-h-screen bg-[#1f2227] text-white">
      {/* Header / Tab Navigation */}
      <div className="bg-[#0e0f10] border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex gap-0">
            <button
              type="button"
              onClick={() => setTab("products")}
              className={`px-4 sm:px-6 py-4 font-semibold transition ${
                tab === "products"
                  ? "text-[#a9d0de] border-b-2 border-[#a9d0de]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📦 Products
            </button>

            <button
              type="button"
              onClick={() => setTab("printify")}
              className={`px-4 sm:px-6 py-4 font-semibold transition ${
                tab === "printify"
                  ? "text-[#a9d0de] border-b-2 border-[#a9d0de]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🖨️ Printify Sync
            </button>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="text-sm text-gray-400 hover:text-red-400 transition px-3 py-2"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {tab === "products" && (
            <AdminProductManager token={token} />
          )}

          {tab === "printify" && (
            <PrintifySync token={token} />
          )}
        </div>
      </div>
    </section>
  );
}
