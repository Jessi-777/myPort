import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AdminProductManager from "../components/AdminProductManager";
import PrintifySync from "../components/PrintifySync";

const API = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [password, setPassword] = useState("");

  const authed = useMemo(() => {
    if (!token) return false;
    try {
      const d = jwtDecode(token);
      return d?.role === "admin";
    } catch {
      return false;
    }
  }, [token]);

  async function login(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API}/api/admin/login`, { password });
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setPassword("");
    } catch (e) {
      alert(e.response?.data?.error || "Login failed");
    }
  }

  if (!authed) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <form onSubmit={login} className="bg-gray-900 p-8 rounded-xl space-y-4 w-full max-w-sm">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <input
            type="password"
            className="w-full p-3 rounded bg-gray-800"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full p-3 bg-blue-600 rounded hover:bg-blue-700">Login</button>
        </form>
      </section>
    );
  }

  return <AdminPanel token={token} />;
}

function AdminPanel({ token }) {
  const [tab, setTab] = useState("products");

  return (
    <section className="min-h-screen bg-[#1f2227]">
      {/* Tab Navigation */}
      <div className="bg-[#0e0f10] border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex gap-0">
          <button
            onClick={() => setTab("products")}
            className={`px-6 py-4 font-semibold transition ${
              tab === "products"
                ? "text-[#a9d0de] border-b-2 border-[#a9d0de]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📦 Products
          </button>
          <button
            onClick={() => setTab("printify")}
            className={`px-6 py-4 font-semibold transition ${
              tab === "printify"
                ? "text-[#a9d0de] border-b-2 border-[#a9d0de]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🖨️ Printify Sync
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {tab === "products" && <AdminProductManager />}
        {tab === "printify" && <PrintifySync />}
      </div>
    </section>
  );
}
