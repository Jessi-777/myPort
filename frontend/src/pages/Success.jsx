import React from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <section className="min-h-screen bg-[#07090d] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10 border border-emerald-400/30">
          <span className="text-4xl">✓</span>
        </div>

        <p className="text-sm uppercase tracking-[0.25em] text-emerald-400 font-bold mb-4">
          Payment Complete
        </p>

        <h1 className="text-4xl md:text-5xl font-black mb-5">
          Payment Successful
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-10">
          Thank you for your purchase. Your order has been
          received successfully.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {sessionId && (
            <Link
              to={`/downloads?session_id=${sessionId}`}
              className="px-6 py-3 rounded-xl bg-emerald-400 text-black font-bold hover:bg-emerald-300 transition"
            >
              Download Your Files
            </Link>
          )}

          <Link
            to="/shop"
            className="px-6 py-3 rounded-xl bg-[#a9d0de] text-black font-bold hover:bg-[#8fc2d5] transition"
          >
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition"
          >
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}