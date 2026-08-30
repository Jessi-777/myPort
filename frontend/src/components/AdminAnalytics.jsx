import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

function StatCard({ label, value, subtext, icon }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#11151a] p-5 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>

          {subtext && (
            <p className="mt-1 text-xs text-gray-500">
              {subtext}
            </p>
          )}
        </div>

        <div className="w-11 h-11 rounded-xl bg-[#1a2028] border border-white/[0.06] flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#11151a] overflow-hidden shadow-xl">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h2 className="font-bold text-white">{title}</h2>
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

export default function AdminAnalytics({ token, onUnauthorized }) {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [overview, setOverview] = useState(null);
  const [daily, setDaily] = useState([]);
  const [pages, setPages] = useState([]);
  const [devices, setDevices] = useState([]);
  const [traffic, setTraffic] = useState([]);

  async function loadAnalytics() {
    if (!API || !token) return;

    setLoading(true);
    setError("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [overviewRes, dailyRes, pagesRes, devicesRes, trafficRes] =
        await Promise.all([
          axios.get(`${API}/api/analytics/overview?days=${days}`, config),
          axios.get(`${API}/api/analytics/daily?days=${days}`, config),
          axios.get(`${API}/api/analytics/pages?days=${days}`, config),
          axios.get(`${API}/api/analytics/devices?days=${days}`, config),
          axios.get(`${API}/api/analytics/traffic?days=${days}`, config),
        ]);

      setOverview(overviewRes.data);
      setDaily(dailyRes.data || []);
      setPages(pagesRes.data || []);
      setDevices(devicesRes.data || []);
      setTraffic(trafficRes.data || []);
    } catch (err) {
      console.error("❌ Analytics load failed:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        onUnauthorized?.();
        return;
      }

      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [days, token]);

  const totals = overview?.totals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Analytics
            </h1>

            <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[11px] font-bold">
              LIVE
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Understand visitors, traffic, engagement and sales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[7, 30, 90].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDays(range)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                days === range
                  ? "bg-[#607b93] text-white"
                  : "bg-[#11151a] border border-white/[0.07] text-gray-400 hover:text-white"
              }`}
            >
              {range}D
            </button>
          ))}

          <button
            type="button"
            onClick={loadAnalytics}
            className="px-3 py-2 rounded-lg bg-[#11151a] border border-white/[0.07] text-gray-400 hover:text-white transition"
            title="Refresh analytics"
          >
            ↻
          </button>
        </div>
      </div>

      {loading && !overview ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#11151a] p-12 text-center">
          <div className="mx-auto w-8 h-8 border-2 border-white/20 border-t-[#a9d0de] rounded-full animate-spin" />

          <p className="mt-4 text-sm text-gray-500">
            Loading analytics...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
          <p className="text-red-400 font-semibold">
            Analytics Error
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {error}
          </p>

          <button
            type="button"
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Visitors"
              value={totals?.visitors?.toLocaleString() || "0"}
              subtext={`${totals?.sessions?.toLocaleString() || 0} sessions`}
              icon="👥"
            />

            <StatCard
              label="Page Views"
              value={totals?.pageViews?.toLocaleString() || "0"}
              subtext={`${totals?.events?.toLocaleString() || 0} total events`}
              icon="👁️"
            />

            <StatCard
              label="Revenue"
              value={`$${Number(totals?.revenue || 0).toFixed(2)}`}
              subtext={`${totals?.orders || 0} orders`}
              icon="💰"
            />

            <StatCard
              label="Conversion"
              value={`${Number(totals?.conversionRate || 0).toFixed(2)}%`}
              subtext={`${totals?.purchases || 0} purchases`}
              icon="📈"
            />
          </div>

          {/* Funnel */}
          <Section title="Conversion Funnel">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                ["Visitors", totals?.visitors || 0],
                ["Product Views", totals?.productViews || 0],
                ["Add to Cart", totals?.addToCart || 0],
                ["Checkout", totals?.checkoutStarted || 0],
                ["Purchases", totals?.purchases || 0],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-[#0c0f13] border border-white/[0.05] p-4"
                >
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-xl font-bold mt-1">
                    {Number(value).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Daily */}
          <Section title="Traffic Over Time">
            {daily.length === 0 ? (
              <p className="text-sm text-gray-500">
                No analytics events yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-white/[0.06]">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Visitors</th>
                      <th className="pb-3">Sessions</th>
                      <th className="pb-3">Page Views</th>
                      <th className="pb-3">Products</th>
                      <th className="pb-3">Purchases</th>
                    </tr>
                  </thead>

                  <tbody>
                    {daily.slice(-14).reverse().map((day) => (
                      <tr
                        key={day.date}
                        className="border-b border-white/[0.04]"
                      >
                        <td className="py-3 text-gray-300">
                          {day.date}
                        </td>

                        <td className="py-3">
                          {day.visitors}
                        </td>

                        <td className="py-3">
                          {day.sessions}
                        </td>

                        <td className="py-3">
                          {day.pageViews}
                        </td>

                        <td className="py-3">
                          {day.productViews}
                        </td>

                        <td className="py-3 text-emerald-400">
                          {day.purchases}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Section title="Top Pages">
              {pages.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No page views yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {pages.slice(0, 10).map((item) => (
                    <div
                      key={item.page}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-sm text-gray-300 truncate">
                        {item.page}
                      </span>

                      <span className="text-xs text-gray-500 shrink-0">
                        {item.views} views
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Devices">
              {devices.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No device data yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {devices.map((item) => (
                    <div key={item.device}>
                      <div className="flex justify-between text-sm">
                        <span>{item.device}</span>
                        <span className="text-gray-500">
                          {item.views} views
                        </span>
                      </div>

                      <div className="mt-2 h-2 rounded-full bg-[#090b0e] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#607b93]"
                          style={{
                            width: `${Math.min(
                              100,
                              (item.views /
                                Math.max(
                                  devices[0]?.views || 1,
                                  1
                                )) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Traffic Sources">
              {traffic.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No traffic source data yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {traffic.slice(0, 10).map((item) => (
                    <div
                      key={item.source}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-sm text-gray-300">
                        {item.source}
                      </span>

                      <span className="text-xs text-gray-500">
                        {item.views} views
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* Extra metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="AOV"
              value={`$${Number(
                totals?.averageOrderValue || 0
              ).toFixed(2)}`}
              icon="🧾"
            />

            <StatCard
              label="Add to Cart"
              value={totals?.addToCart?.toLocaleString() || "0"}
              icon="🛒"
            />

            <StatCard
              label="Checkouts"
              value={
                totals?.checkoutStarted?.toLocaleString() || "0"
              }
              icon="💳"
            />

            <StatCard
              label="Signups"
              value={totals?.signups?.toLocaleString() || "0"}
              icon="✨"
            />
          </div>
        </>
      )}
    </div>
  );
}

