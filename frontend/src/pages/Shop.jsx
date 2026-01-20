import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { handleCheckout } from "../stripe";
import { FaMusic, FaShoppingBag, FaDownload, FaHeart, FaPlay, FaPause } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;
const TARGET_VOL = 0.3;
const FADE_MS = 2000;
const STEP_MS = 50;

const Shop = () => {
  const audioRef = useRef(null);
  const fadeTimer = useRef(null);
  const delayTimer = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isMuted, setIsMuted] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [playingPreview, setPlayingPreview] = useState(null);
  const previewRefs = useRef({});

  // Fade volume to target over time
  const fadeVolume = (to) => {
    if (!audioRef.current) return;
    clearInterval(fadeTimer.current);

    const audio = audioRef.current;
    const from = audio.volume;
    const steps = Math.ceil(FADE_MS / STEP_MS);
    const delta = (to - from) / steps;
    let currentStep = 0;

    fadeTimer.current = setInterval(() => {
      currentStep += 1;
      audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
      if (currentStep >= steps) clearInterval(fadeTimer.current);
    }, STEP_MS);
  };

  // Toggle mute with fade in/out
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.muted || isMuted) {
      audio.muted = false;
      fadeVolume(TARGET_VOL);
      setIsMuted(false);
    } else {
      fadeVolume(0);
      setTimeout(() => {
        audio.muted = true;
        setIsMuted(true);
      }, FADE_MS);
    }
  };

  // Fetch public products from backend
  const loadProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/products`);
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Setup audio autoplay on page load
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0;
    audio.muted = true;

    delayTimer.current = setTimeout(() => {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          fadeVolume(TARGET_VOL);
          setIsMuted(false);
        })
        .catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
    }, 1000); // Auto-play after 1s

    // Pause on tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      } else if (!audio.paused && !audio.muted) {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(fadeTimer.current);
      clearTimeout(delayTimer.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
    };
  }, []);

  // Filter products based on selection
  const filteredProducts = products.filter((product) => {
    if (filter === "digital") return product.productType === "digital" || !product.productType;
    if (filter === "physical") return product.productType === "physical";
    if (filter === "music") return product.category === "music" || product.tags?.includes("music");
    return true;
  });

  const handleProductCheckout = async (product) => {
    if (product.productType === "physical" || product.printifyProductId) {
      try {
        const response = await axios.post(`${API}/api/checkout/printify`, {
          items: [{
            productId: product._id,
            variantId: product.printifyData?.variants[0]?.variantId,
            quantity: 1,
          }],
        });
        window.location.href = response.data.url;
      } catch (error) {
        console.error("Checkout error:", error);
        alert("Failed to start checkout");
      }
    } else if (product.priceId) {
      handleCheckout(product.priceId);
    } else {
      alert("Product not available for purchase");
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const togglePreview = (productId, fileKey) => {
    if (playingPreview === productId) {
      previewRefs.current[productId]?.pause();
      setPlayingPreview(null);
    } else {
      Object.values(previewRefs.current).forEach(audio => audio?.pause());
      previewRefs.current[productId]?.play();
      setPlayingPreview(productId);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1f2227] to-[#0f1419] flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#a9d0de]/10 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <audio ref={audioRef} preload="auto">
        <source src="/river.wav" type="audio/wav" />
      </audio>

      {/* HERO */}
      <div className="relative h-[500px] w-full bg-cover bg-center flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#1f2227]"
          style={{
            backgroundImage: "url('/shop.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <div className="relative z-10 text-center px-4 py-16">
          <div className="inline-block mb-6 px-6 py-2 bg-[#a9d0de]/20 backdrop-blur-sm rounded-full border border-[#a9d0de]/30">
            <span className="text-[#a9d0de]  font-semibold text-sm">✨ Exclusive Digital Marketplace</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-[#769eb5] to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
            The Shop
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
            Curated <span className="text-[#a9d0de] font-bold">sound packs</span>, 
            <span className="text-purple-300 font-bold"> visual art</span>, and 
            <span className="text-[#a9d0de] font-bold"> limited editions</span> crafted by Tica Rey
          </p>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl w-full mx-auto px-6 py-20 flex-1 relative z-10">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { key: 'all', label: 'All Products', icon: '✨' },
            { key: 'digital', label: 'Digital', icon: <FaDownload /> },
            { key: 'physical', label: 'Physical', icon: <FaShoppingBag /> },
            { key: 'music', label: 'Music', icon: <FaMusic /> }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`group relative px-8 py-3 rounded-md font-bold transition-all duration-300 ${
                filter === key
                  ? "bg-gradient-to-r from-[#a9d0de] to-[#7eb4c9] text-black shadow-md shadow-[#a9d0de]/50 scale-105"
                  : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <span className="flex items-center gap-2">
                {typeof icon === 'string' ? icon : <span className="text-lg">{icon}</span>}
                {label}
              </span>
              {filter === key && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#a9d0de] to-purple-400 blur-xl opacity-50 -z-10"></div>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white text-xl animate-pulse">
            Loading products...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center text-white text-xl">
            No products available in this category. Check back soon!
          </div>
        )}

        {/* Product Cards */}
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="relative p-6 bg-[#0e0f10] object-cover mb-4 h-full w-full
                         bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 
                         border border-gray-900 rounded-2xl shadow-lg 
                         hover:scale-105 transition-transform duration-300"
            >
              {/* Product Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                product.isFree 
                  ? 'bg-green-500 text-white animate-pulse' 
                  : 'bg-[#a9d0de] text-black'
              }`}>
                {product.isFree
                  ? "⚡ FREE"
                  : product.category === "music" || product.tags?.includes("music")
                  ? "🎵 Music"
                  : product.productType === "physical"
                  ? "🛍️ Physical"
                  : "📥 Digital"}
              </div>

              <img
                src={product.imageUrl || "/placeholder.png"}
                alt={product.title}
                className="w-full h-52 object-cover rounded-2xl"
              />

              <div className="p-4">
                <h3 className="text-xl font-bold text-[#173767] dark:text-white">
                  {product.title}
                </h3>

                <p className="mt-1 text-sm text-gray-400">{product.description}</p>

                {/* Price Display */}
                {product.isFree ? (
                  <p className="mt-2 text-[#e0a714] font-bold text-lg">
                    FREE DOWNLOAD
                  </p>
                ) : (
                  <p className="mt-2 text-white dark:text-white font-semibold">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                )}

                <br />

                {product.isFree ? (
                  <a
                    href={product.fileKey || '#'}
                    download
                    className="px-6 py-4 w-full flex items-center justify-center gap-2 text-white font-semibold rounded-lg shadow-[0_0_1px_rgba(255,255,255,0.3)] 
                               hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-gradient-to-r 
                               transition duration-300 transform hover:scale-105"
                  >
                    <FaDownload /> Download Free
                  </a>
                ) : (
                  <button
                    onClick={() => handleProductCheckout(product)}
                    className="px-6 py-4 w-full text-white font-semibold rounded-lg shadow-[0_0_1px_rgba(255,255,255,0.3)] 
                               hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-cover bg-center 
                               transition duration-300 transform hover:scale-105"
                    style={{
                      backgroundImage: "url('space.jpg')",
                    }}
                  >
                    Buy Now
                  </button>
                )}

                <button
                  className="absolute bottom-5 right-5 text-white text-xl hover:scale-110 transition"
                  aria-label="Favorite"
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;





