import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function Downloads() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDownloads() {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/downloads?session_id=${sessionId}`
        );
        setItems(data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDownloads();
  }, []);

  if (loading) return <p className="text-center">Loading your files…</p>;

  return (
    <section className="min-h-screen py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-8">Your Downloads</h1>

      {items.length === 0 && <p>No items found.</p>}

      <div className="grid gap-6 max-w-xl mx-auto">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            className="p-5 bg-gray-900 rounded-xl shadow hover:bg-gray-700"
            download
          >
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p>Click to download</p>
          </a>
        ))}
      </div>
    </section>
  );
}
