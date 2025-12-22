import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priceId: "",
    imageUrl: "",
    file: null,
    visible: true
  });
  const [loading, setLoading] = useState(false);

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  async function load() {
    const { data } = await axios.get(`${API}/api/admin/products`, auth);
    setProducts(data.products);
  }

  useEffect(() => { load(); }, []);

  async function uploadToS3(file) {
    // choose a key; keep it unique (folders per product)
    const key = `products/${Date.now()}_${file.name}`;
    const { data } = await axios.post(`${API}/api/admin/uploads/presign`, {
      key,
      contentType: file.type || "application/octet-stream"
    }, auth);

    // PUT the file directly to S3
    await axios.put(data.url, file, {
      headers: { "Content-Type": file.type || "application/octet-stream" }
    });

    return key; // store this as fileKey
  }

  async function createProduct(e) {
    e.preventDefault();
    try {
      setLoading(true);
      let fileKey = "";
      if (form.file) fileKey = await uploadToS3(form.file);

      const payload = {
        title: form.title,
        description: form.description,
        priceId: form.priceId,
        imageUrl: form.imageUrl,
        fileKey,
        visible: form.visible
      };

      const { data } = await axios.post(`${API}/api/admin/products`, payload, auth);
      setProducts((p) => [data.product, ...p]);
      setForm({ title: "", description: "", priceId: "", imageUrl: "", file: null, visible: true });
      alert("Product created ✅");
    } catch (e) {
      alert(e.response?.data?.error || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  async function removeProduct(id) {
    if (!confirm("Delete this product?")) return;
    await axios.delete(`${API}/api/admin/products/${id}`, auth);
    setProducts((p) => p.filter((x) => x._id !== id));
  }

  async function toggleVisible(p) {
    const { data } = await axios.put(`${API}/api/admin/products/${p._id}`, { visible: !p.visible }, auth);
    setProducts((list) => list.map((x) => (x._id === p._id ? data.product : x)));
  }

  return (
    <section className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <form onSubmit={createProduct} className="bg-gray-900 p-6 rounded-xl grid gap-4 md:grid-cols-2">
        <input className="p-3 rounded bg-gray-800" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})}/>
        <input className="p-3 rounded bg-gray-800" placeholder="Stripe Price ID" value={form.priceId} onChange={(e)=>setForm({...form, priceId:e.target.value})}/>
        <input className="p-3 rounded bg-gray-800 md:col-span-2" placeholder="Image URL (public)" value={form.imageUrl} onChange={(e)=>setForm({...form, imageUrl:e.target.value})}/>
        <textarea className="p-3 rounded bg-gray-800 md:col-span-2" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={form.visible} onChange={(e)=>setForm({...form, visible:e.target.checked})}/>
          <span>Visible</span>
        </div>
        <input type="file" onChange={(e)=>setForm({...form, file: e.target.files?.[0] || null})}/>
        <button disabled={loading} className="p-3 bg-blue-600 rounded hover:bg-blue-700 md:col-span-2">
          {loading ? "Saving..." : "Create Product"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Products</h2>
      <div className="grid gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-gray-900 p-4 rounded-xl flex items-center gap-4">
            {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-16 h-16 object-cover rounded"/> : <div className="w-16 h-16 rounded bg-gray-800" />}
            <div className="flex-1">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-400">{p.priceId}</div>
              <div className="text-xs text-gray-500 truncate">{p.fileKey}</div>
            </div>
            <button onClick={()=>toggleVisible(p)} className="px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-700">
              {p.visible ? "Hide" : "Show"}
            </button>
            <button onClick={()=>removeProduct(p._id)} className="px-3 py-2 bg-red-600 rounded hover:bg-red-700">
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
