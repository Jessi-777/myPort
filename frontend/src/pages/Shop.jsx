
import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import {
  handleCheckout,
  handlePhysicalCheckout,
} from "../stripe";

import {
  FaMusic,
  FaShoppingBag,
  FaDownload,
  FaHeart,
  FaPlay,
  FaPause,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

const API = (import.meta.env.VITE_API_URL || "").replace(
  /\/$/,
  ""
);

const TARGET_VOL = 0.3;
const FADE_MS = 2000;
const STEP_MS = 50;

const Shop = () => {
  const audioRef = useRef(null);
  const fadeTimer = useRef(null);
  const delayTimer = useRef(null);
  const userToggledRef = useRef(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isMuted, setIsMuted] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [playingPreview, setPlayingPreview] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);

  const previewRefs = useRef({});

  /*
   * --------------------------------------------------
   * FREE SONG DOWNLOAD MODAL
   * --------------------------------------------------
   */

  const [showFreeDownloadModal, setShowFreeDownloadModal] =
    useState(false);

  const [freeDownloadProduct, setFreeDownloadProduct] =
    useState(null);

  const [freeDownloadEmail, setFreeDownloadEmail] =
    useState("");

  const [marketingConsent, setMarketingConsent] =
    useState(false);

  const [freeDownloadStatus, setFreeDownloadStatus] =
    useState("idle");

  const [freeDownloadError, setFreeDownloadError] =
    useState("");

  /*
   * --------------------------------------------------
   * AUDIO
   * --------------------------------------------------
   */

  const fadeVolume = (to) => {
    if (!audioRef.current) return;

    clearInterval(fadeTimer.current);

    const audio = audioRef.current;
    const from = audio.volume;

    const steps = Math.ceil(
      FADE_MS / STEP_MS
    );

    const delta = (to - from) / steps;

    let currentStep = 0;

    fadeTimer.current = setInterval(() => {
      currentStep += 1;

      audio.volume = Math.max(
        0,
        Math.min(
          1,
          audio.volume + delta
        )
      );

      if (currentStep >= steps) {
        clearInterval(fadeTimer.current);
      }
    }, STEP_MS);
  };

  const toggleMute = () => {
    const audio = audioRef.current;

    if (!audio) return;

    userToggledRef.current = true;

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

  /*
   * --------------------------------------------------
   * PRODUCTS
   * --------------------------------------------------
   */

  const loadProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API}/api/products`
      );

      const productList = Array.isArray(data)
        ? data
        : data?.products || [];

      setProducts(
        productList.filter(
          (product) =>
            product.visible !== false
        )
      );
    } catch (error) {
      console.error(
        "❌ Failed to load products:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /*
   * --------------------------------------------------
   * BACKGROUND AUDIO
   * --------------------------------------------------
   */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.loop = true;
    audio.volume = 0;
    audio.muted = true;

    delayTimer.current = setTimeout(() => {
      if (userToggledRef.current) return;

      audio.muted = false;

      audio
        .play()
        .then(() => {
          if (userToggledRef.current) return;
          fadeVolume(TARGET_VOL);
          setIsMuted(false);
        })
        .catch((err) => {
          console.warn(
            "Autoplay blocked:",
            err
          );
        });
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      } else if (
        !audio.paused &&
        !audio.muted
      ) {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      clearInterval(fadeTimer.current);
      clearTimeout(delayTimer.current);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      audio.pause();
    };
  }, []);

  /*
   * --------------------------------------------------
   * FILTERING
   * --------------------------------------------------
   */

  const filteredProducts = products.filter(
    (product) => {
      if (filter === "digital") {
        return (
          product.productType === "digital" ||
          !product.productType
        );
      }

      if (filter === "physical") {
        return (
          product.productType === "physical"
        );
      }

      if (filter === "music") {
        return (
          product.category === "music" ||
          product.tags?.includes("music")
        );
      }

      return true;
    }
  );

  /*
   * --------------------------------------------------
   * FAVORITES
   * --------------------------------------------------
   */

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter(
            (id) => id !== productId
          )
        : [...prev, productId]
    );
  };

  /*
   * --------------------------------------------------
   * AUDIO PREVIEWS
   * --------------------------------------------------
   */

  const togglePreview = (productId) => {
    const audio =
      previewRefs.current[productId];

    if (!audio) return;

    if (playingPreview === productId) {
      audio.pause();
      setPlayingPreview(null);
      return;
    }

    Object.values(
      previewRefs.current
    ).forEach((item) => {
      if (item) {
        item.pause();
        item.currentTime = 0;
      }
    });

    audio
      .play()
      .then(() => {
        setPlayingPreview(productId);
      })
      .catch((error) => {
        console.error(
          "Preview failed:",
          error
        );
      });
  };

  /*
   * --------------------------------------------------
   * FREE SONG DOWNLOAD
   * --------------------------------------------------
   */

  const openFreeDownloadModal = (product) => {
    setFreeDownloadProduct(product);
    setFreeDownloadEmail("");
    setMarketingConsent(false);
    setFreeDownloadError("");
    setFreeDownloadStatus("idle");
    setShowFreeDownloadModal(true);
  };

  const closeFreeDownloadModal = () => {
    if (
      freeDownloadStatus === "loading"
    ) {
      return;
    }

    setShowFreeDownloadModal(false);
    setFreeDownloadProduct(null);
    setFreeDownloadEmail("");
    setMarketingConsent(false);
    setFreeDownloadError("");
    setFreeDownloadStatus("idle");
  };

  const handleFreeDownload = async (event) => {
    event.preventDefault();

    setFreeDownloadError("");

    const email =
      freeDownloadEmail.trim();

    if (!email) {
      setFreeDownloadError(
        "Please enter your email address."
      );
      return;
    }

    if (!freeDownloadProduct?._id) {
      setFreeDownloadError(
        "This free song is not available for download yet."
      );
      return;
    }

    try {
      setFreeDownloadStatus("loading");

      const { data } = await axios.post(
        `${API}/api/products/${freeDownloadProduct._id}/free-download`,
        {
          email,
          marketingConsent,
        }
      );

      setFreeDownloadStatus("success");

      /*
       * Give the success message a moment to display,
       * then send the visitor to the actual free file.
       */

      setTimeout(() => {
        window.location.assign(
          data.downloadUrl
        );
      }, 900);
    } catch (error) {
      console.error(
        "❌ Free download failed:",
        error
      );

      setFreeDownloadStatus("error");

      setFreeDownloadError(
        error?.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    }
  };

  /*
   * --------------------------------------------------
   * CHECKOUT
   * --------------------------------------------------
   */

  const handleProductCheckout = async (
    product
  ) => {
    if (!product?._id) {
      alert(
        "Product information is missing."
      );
      return;
    }

    if (product.comingSoon) {
      return;
    }

    /*
     * FREE PRODUCTS
     *
     * Free products are handled through the
     * email modal above.
     */

    if (product.isFree) {
      openFreeDownloadModal(product);
      return;
    }

    try {
      setCheckoutId(product._id);

      /*
       * PHYSICAL PRODUCT
       */

      if (
        product.productType ===
        "physical"
      ) {
        await handlePhysicalCheckout(
          product._id,
          null,
          1
        );

        return;
      }

      /*
       * DIGITAL PRODUCT
       */

      if (
        product.productType ===
        "digital"
      ) {
        if (
          !Number.isFinite(product.price) ||
          product.price <= 0
        ) {
          throw new Error(
            "This digital product does not have a valid price."
          );
        }

        await handleCheckout(
          product._id
        );

        return;
      }

      throw new Error(
        `Unsupported product type: ${
          product.productType ||
          "unknown"
        }`
      );
    } catch (error) {
      console.error(
        "❌ Product checkout failed:",
        error
      );

      alert(
        error?.message ||
          "Unable to start checkout."
      );
    } finally {
      setCheckoutId(null);
    }
  };

  /*
   * --------------------------------------------------
   * PRODUCT BADGE
   * --------------------------------------------------
   */

  const getProductBadge = (product) => {
    if (product.isFree) {
      return {
        label: "⚡ FREE",
        className:
          "bg-emerald-400/90 text-black border-emerald-300/50",
      };
    }

    if (
      product.category === "music" ||
      product.tags?.includes("music")
    ) {
      return {
        label: "🎵 MUSIC",
        className:
          "bg-[#a9d0de]/90 text-black border-[#a9d0de]/50",
      };
    }

    if (
      product.productType ===
      "physical"
    ) {
      return {
        label: "🛍 PHYSICAL",
        className:
          "bg-white/90 text-black border-white/40",
      };
    }

    return {
      label: "📥 DIGITAL",
      className:
        "bg-[#7eb4c9]/90 text-black border-[#7eb4c9]/50",
    };
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1f2227] to-[#0f1419] flex flex-col relative overflow-hidden">

      {/* ---------------------------------------------
          AMBIENT BACKGROUND
      --------------------------------------------- */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="
            absolute
            w-96
            h-96
            bg-[#a9d0de]/10
            rounded-full
            blur-3xl
            top-20
            left-10
            animate-pulse
          "
        />

        <div
          className="
            absolute
            w-96
            h-96
            bg-purple-500/10
            rounded-full
            blur-3xl
            bottom-20
            right-10
            animate-pulse
          "
          style={{
            animationDelay: "1s",
          }}
        />
      </div>

      {/* ---------------------------------------------
          AMBIENT AUDIO
      --------------------------------------------- */}

      <audio
        ref={audioRef}
        preload="auto"
      >
        <source
          src="/river.wav"
          type="audio/wav"
        />
      </audio>

      {/* ---------------------------------------------
          HERO
      --------------------------------------------- */}

      <div className="relative h-[500px] w-full flex items-center justify-center">
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-black/80
            via-black/20
            to-[#1f2227]
          "
        />

        <div className="relative z-10 text-center px-4 py-16">

          <div
            className="
              inline-flex
              items-center
              mb-6
              px-6
              py-2
              bg-[#a9d0de]/20
              backdrop-blur-sm
              rounded-full
              border
              border-[#a9d0de]/30
            "
          >
            <span className="text-[#a9d0de] font-semibold text-sm">
              ✨ Exclusive Digital Marketplace
            </span>
          </div>

          <h1
            className="
              text-6xl
              md:text-7xl
              font-extrabold
              mb-6
              bg-gradient-to-r
              from-white
              via-[#769eb5]
              to-blue-500
              bg-clip-text
              text-transparent
              drop-shadow-2xl
            "
          >
            Founders Collection
          </h1>

          <p
            className="
              text-xl
              md:text-2xl
              max-w-3xl
              mx-auto
              text-gray-300
              leading-relaxed
            "
          >
            Curated{" "}
            <span className="text-[#a9d0de] font-bold">
              sound packs, apps
            </span>
            ,{" "}
            <span className="text-[#83bad8] font-bold">
              visual art
            </span>
            , and{" "}
            <span className="text-[#a9d0de] font-bold">
              limited editions
            </span>{" "}
            crafted by our Brands.
          </p>

          <div
            className="
              mt-10
              inline-flex
              items-center
              gap-3
              px-6
              py-3
              rounded-2xl
              border
              border-amber-400/30
              bg-amber-400/10
              backdrop-blur-sm
              shadow-lg
              shadow-amber-900/20
            "
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="
                  animate-ping
                  absolute
                  inline-flex
                  h-full
                  w-full
                  rounded-full
                  bg-amber-400
                  opacity-75
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  rounded-full
                  h-2.5
                  w-2.5
                  bg-amber-400
                "
              />
            </span>

            <p className="text-amber-300 text-sm font-medium tracking-wide">
              Products are currently in production — available soon
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------
          STORE
      --------------------------------------------- */}

      <div
        className="
          max-w-7xl
          w-full
          mx-auto
          px-6
          py-20
          flex-1
          relative
          z-10
        "
      >

        {/* FILTERS */}

        <div className="flex flex-wrap justify-center gap-4 mb-16">

          {[
            {
              key: "all",
              label: "All Products",
              icon: "✨",
            },
            {
              key: "digital",
              label: "Digital",
              icon: <FaDownload />,
            },
            {
              key: "physical",
              label: "Physical",
              icon: <FaShoppingBag />,
            },
            {
              key: "music",
              label: "Music",
              icon: <FaMusic />,
            },
          ].map(
            ({
              key,
              label,
              icon,
            }) => (
              <button
                key={key}
                onClick={() =>
                  setFilter(key)
                }
                className={`
                  group
                  relative
                  px-8
                  py-3
                  rounded-md
                  font-bold
                  transition-all
                  duration-300
                  ${
                    filter === key
                      ? "bg-gradient-to-r from-[#a9d0de] to-[#7eb4c9] text-black shadow-md shadow-[#a9d0de]/50 scale-105"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {typeof icon ===
                  "string" ? (
                    icon
                  ) : (
                    <span className="text-lg">
                      {icon}
                    </span>
                  )}

                  {label}
                </span>
              </button>
            )
          )}
        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-center text-white text-xl animate-pulse">
            Loading products...
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          filteredProducts.length ===
            0 && (
            <div className="text-center text-gray-400 text-lg py-20">
              No products available in this category yet.
            </div>
          )}

        {/* ---------------------------------------------
            PRODUCT GRID
        --------------------------------------------- */}

        <div
          className="
            grid
            gap-8
            sm:grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {filteredProducts.map(
            (product) => {
              const badge =
                getProductBadge(
                  product
                );

              const isFavorite =
                favorites.includes(
                  product._id
                );

              const isMusic =
                product.category ===
                  "music" ||
                product.tags?.includes(
                  "music"
                );

              const isCheckingOut =
                checkoutId ===
                product._id;

              return (
                <article
                  key={product._id}
                  className="
                    group
                    relative
                    flex
                    flex-col
                    overflow-hidden
                    bg-[#0b0d10]/95
                    border
                    border-white/10
                    rounded-2xl
                    shadow-[0_15px_45px_rgba(0,0,0,0.35)]
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:border-[#a9d0de]/35
                    hover:shadow-[0_25px_65px_rgba(0,0,0,0.55)]
                  "
                >

                  {/* IMAGE FRAME */}

                  <div
                    className="
                      relative
                      overflow-hidden
                      bg-[#11151b]
                      p-4
                    "
                  >
                    <div
                      className="
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        border-white/10
                        bg-black/20
                      "
                    >

                      <img
                        src={
                          product.imageUrl ||
                          "/placeholder.png"
                        }
                        alt={
                          product.title
                        }
                        className="
                          w-full
                          h-52
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-[1.04]
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/60
                          via-transparent
                          to-transparent
                          pointer-events-none
                        "
                      />

                      {/* PRODUCT BADGE */}

                      <div
                        className={`
                          absolute
                          top-3
                          left-3
                          px-3
                          py-1.5
                          rounded-full
                          border
                          backdrop-blur-md
                          text-[10px]
                          font-bold
                          tracking-widest
                          ${badge.className}
                        `}
                      >
                        {badge.label}
                      </div>

                      {/* FAVORITE */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleFavorite(
                            product._id
                          )
                        }
                        className="
                          absolute
                          top-3
                          right-3
                          w-9
                          h-9
                          rounded-full
                          flex
                          items-center
                          justify-center
                          bg-black/50
                          backdrop-blur-md
                          border
                          border-white/10
                          text-white
                          transition-all
                          duration-300
                          hover:bg-white/10
                          hover:scale-110
                        "
                        aria-label="Favorite"
                      >
                        <FaHeart
                          className={
                            isFavorite
                              ? "text-red-400"
                              : "text-white/70"
                          }
                        />
                      </button>

                      {/* MUSIC PREVIEW (free tracks only) */}

                      {isMusic && product.isFree && product.fileKey && (
                        <button
                          type="button"
                          onClick={() =>
                            togglePreview(product._id)
                          }
                          className="
                            absolute
                            bottom-4
                            left-4
                            w-11
                            h-11
                            rounded-full
                            bg-white
                            text-black
                            flex
                            items-center
                            justify-center
                            shadow-xl
                            transition-transform
                            hover:scale-110
                          "
                          aria-label={
                            playingPreview === product._id
                              ? "Pause preview"
                              : "Play preview"
                          }
                        >
                          {playingPreview === product._id ? (
                            <FaPause />
                          ) : (
                            <FaPlay className="ml-0.5" />
                          )}

                          <audio
                            ref={(el) => {
                              previewRefs.current[product._id] = el;
                            }}
                            src={product.fileKey}
                            onEnded={() =>
                              setPlayingPreview(null)
                            }
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="flex flex-col flex-1 px-5 pb-5 pt-3">

                    {/* CATEGORY */}

                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="
                          text-[10px]
                          uppercase
                          tracking-[0.18em]
                          font-semibold
                          text-[#96b9c6]
                        "
                      >
                        {isMusic
                          ? "Audio Collection"
                          : product.productType ===
                            "physical"
                          ? "Limited Edition"
                          : "Digital Collection"}
                      </span>
                    </div>

                    {/* TITLE */}

                    <h3
                      className="
                        text-xl
                        font-bold
                        text-white
                        leading-tight
                        mb-2
                        transition-colors
                        duration-300
                        group-hover:text-[#a9d0de]
                      "
                    >
                      {product.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        text-sm
                        text-gray-400
                        leading-6
                        line-clamp-2 
                        min-h-[48px]
                      "
                    >
                      {product.description}
                    </p>

                    {/* PRICE / ACTION */}

                    <div
                      className="
                        mt-5
                        pt-4
                        border-t
                        border-white/10
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >

                      <div>
                        {product.isFree ? (
                          <div>
                            <span
                              className="
                                block
                                text-[10px]
                                uppercase
                                tracking-widest
                                text-gray-500
                                mb-1
                              "
                            >
                              Available
                            </span>

                            <span
                              className="
                                text-lg
                                font-extrabold
                                text-[#a9d0de]
                              "
                            >
                              FREE
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span
                              className="
                                block
                                text-[10px]
                                uppercase
                                tracking-widest
                                text-gray-500
                                mb-1
                              "
                            >
                              Price
                            </span>

                            <span
                              className="
                                text-lg
                                font-bold
                                text-white
                              "
                            >
                              $
                              {(
                                product.price /
                                100
                              ).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ACTION */}

                      {product.comingSoon ? (
                        <button
                          type="button"
                          disabled
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-lg
                            bg-white/5
                            border
                            border-white/10
                            text-white/40
                            text-sm
                            font-semibold
                            cursor-not-allowed
                          "
                        >
                          🔜 Coming Soon
                        </button>
                      ) : product.isFree ? (
                        <button
                          type="button"
                          onClick={() =>
                            openFreeDownloadModal(
                              product
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-lg
                            bg-white/5
                            border
                            border-white/10
                            text-white
                            text-sm
                            font-semibold
                            transition-all
                            duration-300
                            hover:bg-[#a9d0de]
                            hover:text-black
                            hover:border-[#a9d0de]
                          "
                        >
                          <FaDownload className="text-xs" />
                          Get Free {product.tags?.includes("app") ? "App" : "Song"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            isCheckingOut
                          }
                          onClick={() =>
                            handleProductCheckout(
                              product
                            )
                          }
                          className="
                            group/button
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-lg
                            bg-gradient-to-r
                            from-[#96b9c6]
                            to-[#335099]
                            text-white
                            text-sm
                            font-semibold
                            shadow-[0_8px_25px_rgba(51,80,153,0.25)]
                            transition-all
                            duration-300
                            hover:shadow-[0_10px_30px_rgba(150,185,198,0.35)]
                            hover:scale-[1.03]
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                          "
                        >
                          {isCheckingOut ? (
                            <>
                              <span
                                className="
                                  w-4
                                  h-4
                                  rounded-full
                                  border-2
                                  border-white/30
                                  border-t-white
                                  animate-spin
                                "
                              />
                              Loading...
                            </>
                          ) : (
                            <>
                              Buy Now
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>

      {/* ==================================================
          FREE SONG EMAIL MODAL
          ================================================== */}

      {showFreeDownloadModal && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            p-4
            bg-black/75
            backdrop-blur-md
          "
          onClick={closeFreeDownloadModal}
        >
          <div
            className="
              relative
              w-full
              max-w-md
              bg-[#0b0d10]
              border
              border-white/10
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL TOP ACCENT */}

            <div
              className="
                h-1
                w-full
                bg-gradient-to-r
                from-[#96b9c6]
                to-[#335099]
              "
            />

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={
                closeFreeDownloadModal
              }
              disabled={
                freeDownloadStatus ===
                "loading"
              }
              className="
                absolute
                top-4
                right-4
                w-9
                h-9
                rounded-full
                flex
                items-center
                justify-center
                bg-white/5
                border
                border-white/10
                text-gray-400
                transition-all
                hover:bg-white/10
                hover:text-white
                disabled:opacity-40
              "
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="p-7">

              {freeDownloadStatus ===
              "success" ? (
                /*
                 * SUCCESS
                 */
                <div className="text-center py-5">

                  <div
                    className="
                      mx-auto
                      w-16
                      h-16
                      rounded-full
                      bg-emerald-400/10
                      border
                      border-emerald-400/20
                      flex
                      items-center
                      justify-center
                      mb-5
                    "
                  >
                    <FaCheckCircle className="text-3xl text-emerald-400" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    You're In.
                  </h3>

                  <p className="text-gray-400 text-sm leading-6">
                    Your free {freeDownloadProduct?.tags?.includes("app") ? "app" : "song"} is ready.
                    Your download will begin
                    in just a moment.
                  </p>
                </div>
              ) : (
                /*
                 * FORM
                 */
                <>
                  <div className="pr-8 mb-6">

                    <span
                      className="
                        block
                        text-[10px]
                        uppercase
                        tracking-[0.18em]
                        font-semibold
                        text-[#96b9c6]
                        mb-2
                      "
                    >
                      {freeDownloadProduct?.tags?.includes("app") ? "Free App" : "Free Music"}
                    </span>

                    <h3 className="text-2xl font-bold text-white">
                      Get Your Free {freeDownloadProduct?.tags?.includes("app") ? "App" : "Song"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400 leading-6">
                      Enter your email to unlock
                      your free download.
                    </p>
                  </div>

                  <form
                    onSubmit={
                      handleFreeDownload
                    }
                  >

                    {/* EMAIL */}

                    <label
                      htmlFor="free-song-email"
                      className="
                        block
                        text-xs
                        font-semibold
                        text-gray-300
                        mb-2
                      "
                    >
                      Email Address
                    </label>

                    <input
                      id="free-song-email"
                      type="email"
                      value={
                        freeDownloadEmail
                      }
                      onChange={(event) =>
                        setFreeDownloadEmail(
                          event.target.value
                        )
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={
                        freeDownloadStatus ===
                        "loading"
                      }
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-lg
                        bg-white/5
                        border
                        border-white/10
                        text-white
                        placeholder:text-gray-600
                        outline-none
                        transition-all
                        focus:border-[#a9d0de]
                        focus:ring-1
                        focus:ring-[#a9d0de]/30
                        disabled:opacity-50
                      "
                    />

                    {/* MARKETING CONSENT */}

                    <label className="mt-5 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          marketingConsent
                        }
                        onChange={(event) =>
                          setMarketingConsent(
                            event.target
                              .checked
                          )
                        }
                        disabled={
                          freeDownloadStatus ===
                          "loading"
                        }
                        className="
                          mt-1
                          w-4
                          h-4
                          accent-[#a9d0de]
                          cursor-pointer
                        "
                      />

                      <span className="text-xs text-gray-400 leading-relaxed">
                        Yes, send me occasional
                        updates about new music,
                        releases, and special offers.
                        I can unsubscribe anytime.
                      </span>
                    </label>

                    {/* ERROR */}

                    {freeDownloadError && (
                      <div
                        className="
                          mt-4
                          px-4
                          py-3
                          rounded-lg
                          border
                          border-red-400/20
                          bg-red-400/10
                        "
                      >
                        <p className="text-xs text-red-300">
                          {
                            freeDownloadError
                          }
                        </p>
                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="mt-6 flex gap-3">

                      <button
                        type="button"
                        onClick={
                          closeFreeDownloadModal
                        }
                        disabled={
                          freeDownloadStatus ===
                          "loading"
                        }
                        className="
                          flex-1
                          px-4
                          py-3
                          rounded-lg
                          bg-white/5
                          border
                          border-white/10
                          text-white
                          text-sm
                          font-semibold
                          transition-all
                          hover:bg-white/10
                          disabled:opacity-40
                        "
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={
                          freeDownloadStatus ===
                          "loading"
                        }
                        className="
                          flex-1
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          px-4
                          py-3
                          rounded-lg
                          bg-gradient-to-r
                          from-[#96b9c6]
                          to-[#335099]
                          text-white
                          text-sm
                          font-semibold
                          transition-all
                          hover:scale-[1.02]
                          hover:shadow-lg
                          hover:shadow-[#335099]/20
                          disabled:opacity-60
                          disabled:cursor-not-allowed
                        "
                      >
                        {freeDownloadStatus ===
                        "loading" ? (
                          <>
                            <span
                              className="
                                w-4
                                h-4
                                rounded-full
                                border-2
                                border-white/30
                                border-t-white
                                animate-spin
                              "
                            />
                            Preparing...
                          </>
                        ) : (
                          <>
                            <FaDownload />
                            Get Free {freeDownloadProduct?.tags?.includes("app") ? "App" : "Song"}
                          </>
                        )}
                      </button>
                    </div>

                    {/* SMALL PRIVACY MESSAGE */}

                    <p className="mt-4 text-center text-[10px] text-gray-600 leading-relaxed">
                      Your email is only used for
                      the download and updates you
                      choose to receive.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Shop;



// import React, {
//   useEffect,
//   useState,
//   useRef,
// } from "react";

// import axios from "axios";

// import {
//   handleCheckout,
//   handlePhysicalCheckout,
// } from "../stripe";

// import {
//   FaMusic,
//   FaShoppingBag,
//   FaDownload,
//   FaHeart,
//   FaPlay,
//   FaPause,
//   FaArrowRight,
//   FaCheckCircle,
// } from "react-icons/fa";

// // const API = import.meta.env.VITE_API_URL;
// const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// const TARGET_VOL = 0.3;
// const FADE_MS = 2000;
// const STEP_MS = 50;

// const Shop = () => {
//   const audioRef = useRef(null);
//   const fadeTimer = useRef(null);
//   const delayTimer = useRef(null);

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");

//   const [isMuted, setIsMuted] = useState(true);
//   const [favorites, setFavorites] = useState([]);

//   const [playingPreview, setPlayingPreview] =
//     useState(null);

//   const [checkoutId, setCheckoutId] =
//     useState(null);

//   const previewRefs = useRef({});

//   /*
//   |--------------------------------------------------------------------------
//   | AUDIO
//   |--------------------------------------------------------------------------
//   */

//   const fadeVolume = (to) => {
//     if (!audioRef.current) return;

//     clearInterval(fadeTimer.current);

//     const audio = audioRef.current;

//     const from = audio.volume;

//     const steps = Math.ceil(
//       FADE_MS / STEP_MS
//     );

//     const delta =
//       (to - from) / steps;

//     let currentStep = 0;

//     fadeTimer.current = setInterval(() => {
//       currentStep += 1;

//       audio.volume = Math.max(
//         0,
//         Math.min(
//           1,
//           audio.volume + delta
//         )
//       );

//       if (currentStep >= steps) {
//         clearInterval(
//           fadeTimer.current
//         );
//       }
//     }, STEP_MS);
//   };

//   const toggleMute = () => {
//     const audio = audioRef.current;

//     if (!audio) return;

//     if (
//       audio.muted ||
//       isMuted
//     ) {
//       audio.muted = false;

//       fadeVolume(TARGET_VOL);

//       setIsMuted(false);
//     } else {
//       fadeVolume(0);

//       setTimeout(() => {
//         audio.muted = true;
//         setIsMuted(true);
//       }, FADE_MS);
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | PRODUCTS
//   |--------------------------------------------------------------------------
//   */

//   const loadProducts = async () => {
//     try {
//       setLoading(true);

//       const { data } =
//         await axios.get(
//           `${API}/api/products`
//         );

//       const productList =
//         Array.isArray(data)
//           ? data
//           : data?.products || [];

//       setProducts(
//         productList.filter(
//           (product) =>
//             product.visible !== false
//         )
//       );

//     } catch (error) {
//       console.error(
//         "❌ Failed to load products:",
//         error
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | BACKGROUND AUDIO
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     const audio = audioRef.current;

//     if (!audio) return;

//     audio.loop = true;
//     audio.volume = 0;
//     audio.muted = true;

//     delayTimer.current =
//       setTimeout(() => {
//         audio.muted = false;

//         audio
//           .play()
//           .then(() => {
//             fadeVolume(TARGET_VOL);
//             setIsMuted(false);
//           })
//           .catch((err) => {
//             console.warn(
//               "Autoplay blocked:",
//               err
//             );
//           });
//       }, 1000);

//     const handleVisibilityChange =
//       () => {
//         if (document.hidden) {
//           audio.pause();
//         } else if (
//           !audio.paused &&
//           !audio.muted
//         ) {
//           audio
//             .play()
//             .catch(() => {});
//         }
//       };

//     document.addEventListener(
//       "visibilitychange",
//       handleVisibilityChange
//     );

//     return () => {
//       clearInterval(
//         fadeTimer.current
//       );

//       clearTimeout(
//         delayTimer.current
//       );

//       document.removeEventListener(
//         "visibilitychange",
//         handleVisibilityChange
//       );

//       audio.pause();
//     };
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | FILTER
//   |--------------------------------------------------------------------------
//   */

//   const filteredProducts =
//     products.filter(
//       (product) => {
//         if (filter === "digital") {
//           return (
//             product.productType ===
//             "digital"
//           );
//         }

//         if (filter === "physical") {
//           return (
//             product.productType ===
//             "physical"
//           );
//         }

//         if (filter === "music") {
//           return (
//             product.category ===
//               "music" ||
//             product.tags?.includes(
//               "music"
//             )
//           );
//         }

//         return true;
//       }
//     );

//   /*
//   |--------------------------------------------------------------------------
//   | FAVORITES
//   |--------------------------------------------------------------------------
//   */

//   const toggleFavorite = (
//     productId
//   ) => {
//     setFavorites((prev) =>
//       prev.includes(productId)
//         ? prev.filter(
//             (id) =>
//               id !== productId
//           )
//         : [
//             ...prev,
//             productId,
//           ]
//     );
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | PREVIEW
//   |--------------------------------------------------------------------------
//   */

//   const togglePreview = (
//     productId
//   ) => {
//     const audio =
//       previewRefs.current[
//         productId
//       ];

//     if (!audio) return;

//     if (
//       playingPreview ===
//       productId
//     ) {
//       audio.pause();
//       setPlayingPreview(null);
//       return;
//     }

//     Object.values(
//       previewRefs.current
//     ).forEach(
//       (item) => {
//         if (item) {
//           item.pause();
//           item.currentTime = 0;
//         }
//       }
//     );

//     audio
//       .play()
//       .then(() => {
//         setPlayingPreview(
//           productId
//         );
//       })
//       .catch((error) => {
//         console.error(
//           "Preview failed:",
//           error
//         );
//       });
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | CHECKOUT
//   |--------------------------------------------------------------------------
//   */

//   const handleProductCheckout = async (product) => {
//   if (!product?._id) {
//     alert("Product information is missing.");
//     return;
//   }

//   if (product.isFree) {
//     if (!product.fileKey) {
//       alert("This free product does not have a download file yet.");
//       return;
//     }

//     window.location.assign(product.fileKey);
//     return;
//   }

//   try {
//     setCheckoutId(product._id);

//     if (product.productType === "physical") {
//       await handlePhysicalCheckout(
//         product._id,
//         null,
//         1
//       );
//       return;
//     }

//     if (product.productType === "digital") {
//       if (
//         typeof product.priceId !== "string" ||
//         !product.priceId.startsWith("price_")
//       ) {
//         throw new Error(
//           `This digital product does not have a valid Stripe Price ID.`
//         );
//       }

//       await handleCheckout(product.priceId);
//       return;
//     }

//     throw new Error(
//       `Unsupported product type: ${product.productType || "unknown"}`
//     );
//   } catch (error) {
//     console.error(
//       "❌ Product checkout failed:",
//       error
//     );

//     alert(
//       error?.message ||
//         "Unable to start checkout."
//     );
//   } finally {
//     setCheckoutId(null);
//   }
// };

//   /*
//   |--------------------------------------------------------------------------
//   | PRODUCT BADGE
//   |--------------------------------------------------------------------------
//   */

//   const getProductBadge = (
//     product
//   ) => {
//     if (product.isFree) {
//       return {
//         label: "FREE",
//         className:
//           "bg-emerald-400 text-black",
//       };
//     }

//     if (
//       product.productType ===
//       "physical"
//     ) {
//       return {
//         label: "PHYSICAL",
//         className:
//           "bg-white text-black",
//       };
//     }

//     if (
//       product.category ===
//         "music" ||
//       product.tags?.includes("music")
//     ) {
//       return {
//         label: "MUSIC",
//         className:
//           "bg-[#a9d0de] text-black",
//       };
//     }

//     return {
//       label: "DIGITAL",
//       className:
//         "bg-indigo-400 text-white",
//     };
//   };

//   return (
//     <section className="min-h-screen bg-gradient-to-br from-[#07090d] via-[#15191e] to-[#090c10] relative overflow-hidden">

//       {/* Ambient background */}

//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute w-[500px] h-[500px] bg-[#a9d0de]/10 rounded-full blur-[120px] -top-32 -left-32" />

//         <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] bottom-0 right-0" />
//       </div>

//       {/* Background audio */}

//       <audio
//         ref={audioRef}
//         preload="auto"
//       >
//         <source
//           src="/river.wav"
//           type="audio/wav"
//         />
//       </audio>

//       {/* HERO */}

//       <div className="relative h-[500px] w-full flex items-center justify-center">

//         <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-[#15191e]" />

//         <div className="relative z-10 text-center px-6">

//           <div className="inline-flex items-center gap-2 mb-7 px-5 py-2 rounded-full border border-[#a9d0de]/30 bg-[#a9d0de]/10 backdrop-blur-md">

//             <span className="w-2 h-2 rounded-full bg-[#a9d0de] animate-pulse" />

//             <span className="text-[#a9d0de] font-semibold text-sm tracking-wider uppercase">
//               Exclusive Digital Marketplace
//             </span>

//           </div>

//           <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-[#a9d0de] to-indigo-400 bg-clip-text text-transparent">
//             Founders Collection
//           </h1>

//           <p className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
//             Curated{" "}
//             <span className="text-[#a9d0de] font-bold">
//               sound packs
//             </span>
//             ,{" "}
//             <span className="text-indigo-300 font-bold">
//               apps
//             </span>
//             ,{" "}
//             <span className="text-[#83bad8] font-bold">
//               visual art
//             </span>
//             , and{" "}
//             <span className="text-[#a9d0de] font-bold">
//               limited editions
//             </span>
//             .
//           </p>

//           <div className="mt-10 inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 backdrop-blur-sm">

//             <span className="relative flex h-2.5 w-2.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
//               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
//             </span>

//             <p className="text-amber-300 text-sm font-medium tracking-wide">
//               New products are being added to the collection
//             </p>

//           </div>

//         </div>
//       </div>

//       {/* PRODUCTS */}

//       <div className="max-w-7xl w-full mx-auto px-6 py-20 relative z-10">

//         {/* FILTERS */}

//         <div className="flex flex-wrap justify-center gap-3 mb-16">

//           {[
//             {
//               key: "all",
//               label: "All Products",
//               icon: "✦",
//             },
//             {
//               key: "digital",
//               label: "Digital",
//               icon: <FaDownload />,
//             },
//             {
//               key: "physical",
//               label: "Physical",
//               icon: <FaShoppingBag />,
//             },
//             {
//               key: "music",
//               label: "Music",
//               icon: <FaMusic />,
//             },
//           ].map(
//             ({
//               key,
//               label,
//               icon,
//             }) => (
//               <button
//                 key={key}
//                 onClick={() =>
//                   setFilter(key)
//                 }
//                 className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 border ${
//                   filter === key
//                     ? "bg-[#a9d0de] text-black border-[#a9d0de] shadow-lg shadow-[#a9d0de]/20"
//                     : "bg-white/[0.03] text-gray-300 border-white/10 hover:bg-white/[0.08] hover:border-white/20"
//                 }`}
//               >
//                 {icon}
//                 {label}
//               </button>
//             )
//           )}

//         </div>

//         {/* LOADING */}

//         {loading && (
//           <div className="flex justify-center py-20">
//             <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#a9d0de] animate-spin" />
//           </div>
//         )}

//         {/* EMPTY */}

//         {!loading &&
//           filteredProducts.length ===
//             0 && (
//             <div className="text-center py-20 text-gray-400">
//               No products available in this category.
//             </div>
//           )}

//         {/* GRID */}

//         <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

//           {filteredProducts.map(
//             (product) => {
//               const badge =
//                 getProductBadge(
//                   product
//                 );

//               const isCheckingOut =
//                 checkoutId ===
//                 product._id;

//               const isDigital =
//                 product.productType ===
//                 "digital";

//               const hasValidStripePrice =
//                 isDigital &&
//                 !product.isFree &&
//                 typeof product.priceId ===
//                   "string" &&
//                 product.priceId.startsWith(
//                   "price_"
//                 );

//               const canPurchase =
//                 product.isFree ||
//                 product.productType ===
//                   "physical" ||
//                 hasValidStripePrice;

//               return (
//                 <article
//                   key={
//                     product._id
//                   }
//                   className="group relative bg-[#0d1014] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#a9d0de]/30 hover:shadow-[#a9d0de]/10"
//                 >

//                   {/* IMAGE */}

//                   <div className="relative overflow-hidden">

//                     <img
//                       src={
//                         product.imageUrl ||
//                         "/placeholder.png"
//                       }
//                       alt={
//                         product.title
//                       }
//                       className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
//                     />

//                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

//                     {/* BADGE */}

//                     <div
//                       className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] tracking-widest font-black ${badge.className}`}
//                     >
//                       {badge.label}
//                     </div>

//                     {/* FAVORITE */}

//                     <button
//                       type="button"
//                       onClick={() =>
//                         toggleFavorite(
//                           product._id
//                         )
//                       }
//                       className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:scale-110"
//                       aria-label="Favorite product"
//                     >
//                       <FaHeart
//                         className={
//                           favorites.includes(
//                             product._id
//                           )
//                             ? "text-red-400"
//                             : "text-white/70"
//                         }
//                       />
//                     </button>

//                     {/* MUSIC PREVIEW */}

//                     {product.previewUrl && (
//                       <button
//                         type="button"
//                         onClick={() =>
//                           togglePreview(
//                             product._id
//                           )
//                         }
//                         className="absolute bottom-4 left-4 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-xl transition-transform hover:scale-110"
//                       >
//                         {playingPreview ===
//                         product._id ? (
//                           <FaPause />
//                         ) : (
//                           <FaPlay className="ml-0.5" />
//                         )}

//                         <audio
//                           ref={(el) => {
//                             previewRefs.current[
//                               product._id
//                             ] = el;
//                           }}
//                           src={
//                             product.previewUrl
//                           }
//                           onEnded={() =>
//                             setPlayingPreview(
//                               null
//                             )
//                           }
//                         />
//                       </button>
//                     )}

//                   </div>

//                   {/* CONTENT */}

//                   <div className="p-6">

//                     <div className="flex items-start justify-between gap-4">

//                       <div>
//                         <p className="text-[10px] uppercase tracking-[0.2em] text-[#a9d0de]/70 font-bold mb-2">
//                           {product.category ||
//                             product.productType}
//                         </p>

//                         <h3 className="text-xl font-black text-white leading-tight">
//                           {
//                             product.title
//                           }
//                         </h3>
//                       </div>

//                     </div>

//                     <p className="mt-3  text-sm text-gray-400 leading-relaxed min-h-[42px]">
//                       {product.description ||
//                         "A curated piece from the Founders Collection."}
//                     </p>

//                     {/* PRICE */}

//                     <div className="mt-6">
//                       <div className="border-t border-white/10 mb-4 w-full" />

//                       <div className="flex items-end justify-between">
//                         <div>
//                           {product.isFree ? (
//                             <>
//                               <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
//                                 Available
//                               </p>

//                               <p className="text-xl font-black text-white">
//                                 FREE
//                               </p>
//                             </>
//                           ) : (
//                             <>
//                               <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
//                                 Price
//                               </p>

//                               <p className="text-2xl font-black text-white">
//                                 ${(product.price / 100).toFixed(2)}
//                               </p>
//                             </>
//                           )}
//                         </div>

//                         {product.isFree && (
//                           <FaCheckCircle className="text-emerald-400 text-lg" />
//                         )}
//                       </div>
//                     </div>

//                     {/* ACTION */}

//                     <div className="mt-6">

//                       {product.isFree ? (
//                         <a
//                           href={
//                             product.fileKey ||
//                             "#"
//                           }
//                           download
//                           className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-emerald-400 text-black font-black transition-all hover:bg-emerald-300 hover:-translate-y-0.5"
//                         >
//                           <FaDownload />
//                           Download Free
//                         </a>
//                       ) : (
//                         <button
//                           type="button"
//                           disabled={
//                             isCheckingOut ||
//                             !canPurchase
//                           }
//                           onClick={() =>
//                             handleProductCheckout(
//                               product
//                             )
//                           }
//                           className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 font-black transition-all ${
//                             canPurchase
//                               ? "bg-gradient-to-r from-[#a9d0de] to-[#7eb4c9] text-black hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#a9d0de]/10"
//                               : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
//                           }`}
//                         >
//                           {isCheckingOut ? (
//                             <>
//                               <span className="w-4 h-4 rounded-md border-2 border-black/30 border-t-black animate-spin" />
//                               Opening Checkout...
//                             </>
//                           ) : product.productType ===
//                             "physical" ? (
//                             <>
//                               <FaShoppingBag />
//                               Buy Now
//                               {/* <FaArrowRight className="text-xs" /> */}
//                             </>
//                           ) : (
//                             <>
//                               <FaDownload />
//                               Buy Digital
//                               {/* <FaArrowRight className="text-xs" /> */}
//                             </>
//                           )}
//                         </button>
//                       )}

//                     </div>

//                     {/* ADMIN/DATA WARNING */}

//                     {!product.isFree &&
//                       !canPurchase && (
//                         <p className="mt-3 text-center text-xs text-amber-400/80">
//                           Stripe Price ID required
//                         </p>
//                       )}

//                   </div>
//                 </article>
//               );
//             }
//           )}

//         </div>
//       </div>

//     </section>
//   );
// };

// export default Shop;




// like this version
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { handleCheckout } from "../stripe";
// import {
//   FaMusic,
//   FaShoppingBag,
//   FaDownload,
//   FaHeart,
//   FaPlay,
//   FaPause,
//   FaArrowRight,
// } from "react-icons/fa";

// const API = import.meta.env.VITE_API_URL;

// const TARGET_VOL = 0.3;
// const FADE_MS = 2000;
// const STEP_MS = 50;

// const Shop = () => {
//   const audioRef = useRef(null);
//   const fadeTimer = useRef(null);
//   const delayTimer = useRef(null);

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [isMuted, setIsMuted] = useState(true);
//   const [favorites, setFavorites] = useState([]);
//   const [playingPreview, setPlayingPreview] = useState(null);

//   const previewRefs = useRef({});

//   // --------------------------------------------------
//   // AUDIO
//   // --------------------------------------------------

//   const fadeVolume = (to) => {
//     if (!audioRef.current) return;

//     clearInterval(fadeTimer.current);

//     const audio = audioRef.current;
//     const from = audio.volume;
//     const steps = Math.ceil(FADE_MS / STEP_MS);
//     const delta = (to - from) / steps;

//     let currentStep = 0;

//     fadeTimer.current = setInterval(() => {
//       currentStep += 1;

//       audio.volume = Math.max(
//         0,
//         Math.min(1, audio.volume + delta)
//       );

//       if (currentStep >= steps) {
//         clearInterval(fadeTimer.current);
//       }
//     }, STEP_MS);
//   };

//   const toggleMute = () => {
//     const audio = audioRef.current;

//     if (!audio) return;

//     if (audio.muted || isMuted) {
//       audio.muted = false;
//       fadeVolume(TARGET_VOL);
//       setIsMuted(false);
//     } else {
//       fadeVolume(0);

//       setTimeout(() => {
//         audio.muted = true;
//         setIsMuted(true);
//       }, FADE_MS);
//     }
//   };

//   // --------------------------------------------------
//   // PRODUCTS
//   // --------------------------------------------------

//   const loadProducts = async () => {
//     try {
//       const { data } = await axios.get(`${API}/api/products`);

//       setProducts(
//         Array.isArray(data)
//           ? data
//           : data.products || []
//       );
//     } catch (error) {
//       console.error("Failed to load products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   // --------------------------------------------------
//   // BACKGROUND AUDIO
//   // --------------------------------------------------

//   useEffect(() => {
//     const audio = audioRef.current;

//     if (!audio) return;

//     audio.loop = true;
//     audio.volume = 0;
//     audio.muted = true;

//     delayTimer.current = setTimeout(() => {
//       audio.muted = false;

//       audio
//         .play()
//         .then(() => {
//           fadeVolume(TARGET_VOL);
//           setIsMuted(false);
//         })
//         .catch((err) => {
//           console.warn("Autoplay blocked:", err);
//         });
//     }, 1000);

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         audio.pause();
//       } else if (!audio.paused && !audio.muted) {
//         audio.play().catch(() => {});
//       }
//     };

//     document.addEventListener(
//       "visibilitychange",
//       handleVisibilityChange
//     );

//     return () => {
//       clearInterval(fadeTimer.current);
//       clearTimeout(delayTimer.current);

//       document.removeEventListener(
//         "visibilitychange",
//         handleVisibilityChange
//       );

//       audio.pause();
//     };
//   }, []);

//   // --------------------------------------------------
//   // FILTERING
//   // --------------------------------------------------

//   const filteredProducts = products.filter((product) => {
//     if (filter === "digital") {
//       return (
//         product.productType === "digital" ||
//         !product.productType
//       );
//     }

//     if (filter === "physical") {
//       return product.productType === "physical";
//     }

//     if (filter === "music") {
//       return (
//         product.category === "music" ||
//         product.tags?.includes("music")
//       );
//     }

//     return true;
//   });

//   // --------------------------------------------------
//   // CHECKOUT
//   // --------------------------------------------------

//   const handleProductCheckout = async (product) => {
//     if (product.priceId) {
//       handleCheckout(product.priceId);
//     } else {
//       alert("Product not available for purchase");
//     }
//   };

//   // --------------------------------------------------
//   // FAVORITES
//   // --------------------------------------------------

//   const toggleFavorite = (productId) => {
//     setFavorites((prev) =>
//       prev.includes(productId)
//         ? prev.filter((id) => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   // --------------------------------------------------
//   // AUDIO PREVIEWS
//   // --------------------------------------------------

//   const togglePreview = (productId) => {
//     if (playingPreview === productId) {
//       previewRefs.current[productId]?.pause();
//       setPlayingPreview(null);
//       return;
//     }

//     Object.values(previewRefs.current).forEach(
//       (audio) => audio?.pause()
//     );

//     previewRefs.current[productId]?.play();

//     setPlayingPreview(productId);
//   };

//   // --------------------------------------------------
//   // PRODUCT TYPE LABEL
//   // --------------------------------------------------

//   const getProductBadge = (product) => {
//     if (product.isFree) {
//       return {
//         label: "⚡ FREE",
//         className:
//           "bg-emerald-400/90 text-black border-emerald-300/50",
//       };
//     }

//     if (
//       product.category === "music" ||
//       product.tags?.includes("music")
//     ) {
//       return {
//         label: "🎵 MUSIC",
//         className:
//           "bg-[#a9d0de]/90 text-black border-[#a9d0de]/50",
//       };
//     }

//     if (product.productType === "physical") {
//       return {
//         label: "🛍 PHYSICAL",
//         className:
//           "bg-white/90 text-black border-white/40",
//       };
//     }

//     return {
//       label: "📥 DIGITAL",
//       className:
//         "bg-[#7eb4c9]/90 text-black border-[#7eb4c9]/50",
//     };
//   };

//   return (
//     <section className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1f2227] to-[#0f1419] flex flex-col relative overflow-hidden">

//       {/* ---------------------------------------------
//           AMBIENT BACKGROUND
//       --------------------------------------------- */}

//       <div className="absolute inset-0 overflow-hidden pointer-events-none">

//         <div
//           className="
//             absolute
//             w-96
//             h-96
//             bg-[#a9d0de]/10
//             rounded-full
//             blur-3xl
//             top-20
//             left-10
//             animate-pulse
//           "
//         />

//         <div
//           className="
//             absolute
//             w-96
//             h-96
//             bg-purple-500/10
//             rounded-full
//             blur-3xl
//             bottom-20
//             right-10
//             animate-pulse
//           "
//           style={{ animationDelay: "1s" }}
//         />

//       </div>

//       {/* ---------------------------------------------
//           AMBIENT AUDIO
//       --------------------------------------------- */}

//       <audio ref={audioRef} preload="auto">
//         <source src="/river.wav" type="audio/wav" />
//       </audio>

//       {/* ---------------------------------------------
//           HERO
//       --------------------------------------------- */}

//       <div className="relative h-[500px] w-full flex items-center justify-center">

//         <div
//           className="
//             absolute
//             inset-0
//             bg-gradient-to-b
//             from-black/80
//             via-black/20
//             to-[#1f2227]
//           "
//         />

//         <div className="relative z-10 text-center px-4 py-16">

//           <div
//             className="
//               inline-flex
//               items-center
//               mb-6
//               px-6
//               py-2
//               bg-[#a9d0de]/20
//               backdrop-blur-sm
//               rounded-full
//               border
//               border-[#a9d0de]/30
//             "
//           >
//             <span className="text-[#a9d0de] font-semibold text-sm">
//               ✨ Exclusive Digital Marketplace
//             </span>
//           </div>

//           <h1
//             className="
//               text-6xl
//               md:text-7xl
//               font-extrabold
//               mb-6
//               bg-gradient-to-r
//               from-white
//               via-[#769eb5]
//               to-blue-500
//               bg-clip-text
//               text-transparent
//               drop-shadow-2xl
//             "
//           >
//             Founders Collection
//           </h1>

//           <p
//             className="
//               text-xl
//               md:text-2xl
//               max-w-3xl
//               mx-auto
//               text-gray-300
//               leading-relaxed
//             "
//           >
//             Curated{" "}
//             <span className="text-[#a9d0de] font-bold">
//               sound packs, apps
//             </span>
//             ,{" "}
//             <span className="text-[#83bad8] font-bold">
//               visual art
//             </span>
//             , and{" "}
//             <span className="text-[#a9d0de] font-bold">
//               limited editions
//             </span>{" "}
//             crafted by our Brands.
//           </p>

//           <div
//             className="
//               mt-10
//               inline-flex
//               items-center
//               gap-3
//               px-6
//               py-3
//               rounded-2xl
//               border
//               border-amber-400/30
//               bg-amber-400/10
//               backdrop-blur-sm
//               shadow-lg
//               shadow-amber-900/20
//             "
//           >
//             <span className="relative flex h-2.5 w-2.5">

//               <span
//                 className="
//                   animate-ping
//                   absolute
//                   inline-flex
//                   h-full
//                   w-full
//                   rounded-full
//                   bg-amber-400
//                   opacity-75
//                 "
//               />

//               <span
//                 className="
//                   relative
//                   inline-flex
//                   rounded-full
//                   h-2.5
//                   w-2.5
//                   bg-amber-400
//                 "
//               />

//             </span>

//             <p className="text-amber-300 text-sm font-medium tracking-wide">
//               Products are currently in production — available soon
//             </p>
//           </div>

//         </div>
//       </div>

//       {/* ---------------------------------------------
//           STORE
//       --------------------------------------------- */}

//       <div
//         className="
//           max-w-7xl
//           w-full
//           mx-auto
//           px-6
//           py-20
//           flex-1
//           relative
//           z-10
//         "
//       >

//         {/* FILTERS */}

//         <div className="flex flex-wrap justify-center gap-4 mb-16">

//           {[
//             {
//               key: "all",
//               label: "All Products",
//               icon: "✨",
//             },
//             {
//               key: "digital",
//               label: "Digital",
//               icon: <FaDownload />,
//             },
//             {
//               key: "physical",
//               label: "Physical",
//               icon: <FaShoppingBag />,
//             },
//             {
//               key: "music",
//               label: "Music",
//               icon: <FaMusic />,
//             },
//           ].map(({ key, label, icon }) => (

//             <button
//               key={key}
//               onClick={() => setFilter(key)}
//               className={`
//                 group
//                 relative
//                 px-8
//                 py-3
//                 rounded-md
//                 font-bold
//                 transition-all
//                 duration-300
//                 ${
//                   filter === key
//                     ? "bg-gradient-to-r from-[#a9d0de] to-[#7eb4c9] text-black shadow-md shadow-[#a9d0de]/50 scale-105"
//                     : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
//                 }
//               `}
//             >
//               <span className="flex items-center gap-2">

//                 {typeof icon === "string" ? (
//                   icon
//                 ) : (
//                   <span className="text-lg">
//                     {icon}
//                   </span>
//                 )}

//                 {label}

//               </span>
//             </button>

//           ))}

//         </div>

//         {/* LOADING */}

//         {loading && (
//           <div className="text-center text-white text-xl animate-pulse">
//             Loading products...
//           </div>
//         )}

//         {/* EMPTY */}

//         {!loading && filteredProducts.length === 0 && (
//           <div className="text-center text-gray-400 text-lg py-20">
//             No products available in this category yet.
//           </div>
//         )}

//         {/* ---------------------------------------------
//             PRODUCT GRID
//         --------------------------------------------- */}

//         <div
//           className="
//             grid
//             gap-8
//             sm:grid-cols-1
//             md:grid-cols-2
//             lg:grid-cols-3
//           "
//         >

//           {filteredProducts.map((product) => {

//             const badge = getProductBadge(product);

//             const isFavorite = favorites.includes(
//               product._id
//             );

//             const isMusic =
//               product.category === "music" ||
//               product.tags?.includes("music");

//             return (

//               <article
//                 key={product._id}
//                 className="
//                   group
//                   relative
//                   flex
//                   flex-col
//                   overflow-hidden

//                   bg-[#0b0d10]/95

//                   border
//                   border-white/10

//                   rounded-2xl

//                   shadow-[0_15px_45px_rgba(0,0,0,0.35)]

//                   transition-all
//                   duration-500

//                   hover:-translate-y-2

//                   hover:border-[#a9d0de]/35

//                   hover:shadow-[0_25px_65px_rgba(0,0,0,0.55)]
//                 "
//               >

//                 {/* ---------------------------------
//                     IMAGE FRAME
//                 --------------------------------- */}

//                 <div
//                   className="
//                     relative
//                     overflow-hidden
//                     bg-[#11151b]
//                     p-3
//                   "
//                 >

//                   <div
//                     className="
//                       relative
//                       overflow-hidden
//                       rounded-xl
//                       border
//                       border-white/10
//                       bg-black/20
//                     "
//                   >

//                     {/* KEEPING YOUR IMAGE SIZE */}
//                     <img
//                       src={
//                         product.imageUrl ||
//                         "/placeholder.png"
//                       }
//                       alt={product.title}
//                       className="
//                         w-full
//                         h-52
//                         object-cover

//                         transition-transform
//                         duration-700

//                         group-hover:scale-[1.04]
//                       "
//                     />

//                     {/* Image gradient */}

//                     <div
//                       className="
//                         absolute
//                         inset-0
//                         bg-gradient-to-t
//                         from-black/60
//                         via-transparent
//                         to-transparent
//                         pointer-events-none
//                       "
//                     />

//                     {/* PRODUCT BADGE */}

//                     <div
//                       className={`
//                         absolute
//                         top-3
//                         left-3
//                         px-3
//                         py-1.5
//                         rounded-full
//                         border
//                         backdrop-blur-md
//                         text-[10px]
//                         font-bold
//                         tracking-widest
//                         ${badge.className}
//                       `}
//                     >
//                       {badge.label}
//                     </div>

//                     {/* FAVORITE */}

//                     <button
//                       onClick={() =>
//                         toggleFavorite(product._id)
//                       }
//                       className="
//                         absolute
//                         top-3
//                         right-3
//                         w-9
//                         h-9
//                         rounded-full
//                         flex
//                         items-center
//                         justify-center

//                         bg-black/50
//                         backdrop-blur-md

//                         border
//                         border-white/10

//                         text-white

//                         transition-all
//                         duration-300

//                         hover:bg-white/10
//                         hover:scale-110
//                       "
//                       aria-label="Favorite"
//                     >
//                       <FaHeart
//                         className={
//                           isFavorite
//                             ? "text-red-400"
//                             : "text-white/70"
//                         }
//                       />
//                     </button>

//                   </div>

//                 </div>

//                 {/* ---------------------------------
//                     CONTENT
//                 --------------------------------- */}

//                 <div className="flex flex-col flex-1 px-5 pb-5 pt-3">

//                   {/* CATEGORY */}

//                   <div className="flex items-center gap-2 mb-2">

//                     <span
//                       className="
//                         text-[10px]
//                         uppercase
//                         tracking-[0.18em]
//                         font-semibold
//                         text-[#96b9c6]
//                       "
//                     >
//                       {isMusic
//                         ? "Audio Collection"
//                         : product.productType === "physical"
//                         ? "Limited Edition"
//                         : "Digital Collection"}
//                     </span>

//                   </div>

//                   {/* TITLE */}

//                   <h3
//                     className="
//                       text-xl
//                       font-bold
//                       text-white
//                       leading-tight
//                       mb-2

//                       transition-colors
//                       duration-300

//                       group-hover:text-[#a9d0de]
//                     "
//                   >
//                     {product.title}
//                   </h3>

//                   {/* DESCRIPTION */}

//                   <p
//                     className="
//                       text-sm
//                       text-gray-400
//                       leading-6
//                       line-clamp-2
//                       min-h-[48px]
//                     "
//                   >
//                     {product.description}
//                   </p>

//                   {/* ---------------------------------
//                       PRICE / ACTION
//                   --------------------------------- */}

//                   <div
//                     className="
//                       mt-5
//                       pt-4
//                       border-t
//                       border-white/10
//                       flex
//                       items-center
//                       justify-between
//                       gap-4
//                     "
//                   >

//                     <div>

//                       {product.isFree ? (

//                         <div>
//                           <span
//                             className="
//                               block
//                               text-[10px]
//                               uppercase
//                               tracking-widest
//                               text-gray-500
//                               mb-1
//                             "
//                           >
//                             Available
//                           </span>

//                           <span
//                             className="
//                               text-lg
//                               font-extrabold
//                               text-[#a9d0de]
//                             "
//                           >
//                             FREE
//                           </span>
//                         </div>

//                       ) : (

//                         <div>
//                           <span
//                             className="
//                               block
//                               text-[10px]
//                               uppercase
//                               tracking-widest
//                               text-gray-500
//                               mb-1
//                             "
//                           >
//                             Price
//                           </span>

//                           <span
//                             className="
//                               text-lg
//                               font-bold
//                               text-white
//                             "
//                           >
//                             ${(product.price / 100).toFixed(2)}
//                           </span>
//                         </div>

//                       )}

//                     </div>

//                     {/* ACTION */}

//                     {product.isFree ? (

//                       <a
//                         href={product.fileKey || "#"}
//                         download
//                         className="
//                           inline-flex
//                           items-center
//                           justify-center
//                           gap-2

//                           px-4
//                           py-2.5

//                           rounded-lg

//                           bg-white/5

//                           border
//                           border-white/10

//                           text-white
//                           text-sm
//                           font-semibold

//                           transition-all
//                           duration-300

//                           hover:bg-[#a9d0de]
//                           hover:text-black
//                           hover:border-[#a9d0de]
//                         "
//                       >
//                         <FaDownload className="text-xs" />
//                         Download
//                       </a>

//                     ) : (

//                       <button
//                         onClick={() =>
//                           handleProductCheckout(product)
//                         }
//                         className="
//                           group/button

//                           inline-flex
//                           items-center
//                           justify-center
//                           gap-2

//                           px-4
//                           py-2.5

//                           rounded-lg

//                           bg-gradient-to-r
//                           from-[#96b9c6]
//                           to-[#335099]

//                           text-white
//                           text-sm
//                           font-semibold

//                           shadow-[0_8px_25px_rgba(51,80,153,0.25)]

//                           transition-all
//                           duration-300

//                           hover:shadow-[0_10px_30px_rgba(150,185,198,0.35)]

//                           hover:scale-[1.03]
//                         "
//                       >
//                         Buy Now

//                         {/* <FaArrowRight
//                           className="
//                             text-xs
//                             transition-transform
//                             duration-300
//                             group-hover/button:translate-x-1
//                           "
//                         /> */}

//                       </button>

//                     )}

//                   </div>

//                 </div>

//               </article>

//             );
//           })}

//         </div>

//       </div>

//     </section>
//   );
// };

// export default Shop;



