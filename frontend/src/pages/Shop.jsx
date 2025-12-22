import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleCheckout } from "../stripe";

const API = import.meta.env.VITE_API_URL;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="min-h-screen bg-[#1f2227] flex flex-col">
      {/* HERO */}
      <div
        className="relative h-[400px] w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/shop.png')",
          backgroundSize: "70%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />

        <div className="relative z-10 text-center px-4 py-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] animate-pulse">
            🛒 Tica's Shop
          </h1>

          <p className="text-lg md:text-2xl max-w-2xl mx-auto text-white drop-shadow-md">
            Exclusive <span className="text-[#a9d0de] font-semibold">sound packs</span>,{" "}
            <span className="text-white font-semibold">visuals</span>, and{" "}
            <span className="text-[#a9d0de] font-semibold">digital creations</span> by Tica Rey.
          </p>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl w-full mx-auto px-6 py-20 flex-1">
        {/* Loading State */}
        {loading && (
          <div className="text-center text-white text-xl animate-pulse">
            Loading products...
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center text-white text-xl">
            No products available yet. Check back soon!
          </div>
        )}

        {/* Product Cards */}
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative p-6 bg-[#0e0f10] object-cover mb-4 h-full w-full
                         bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 
                         border border-gray-900 rounded-2xl shadow-lg 
                         hover:scale-105 transition-transform duration-300"
            >
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

                <p className="mt-2 text-white dark:text-white">${product.priceId ? "" : ""}</p>

                <br />

                <button
                  onClick={() => handleCheckout(product.priceId)}
                  className="px-6 py-4 text-white font-semibold rounded-lg shadow-[0_0_1px_rgba(255,255,255,0.3)] 
                             hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-cover bg-center 
                             transition duration-300 transform hover:scale-105"
                  style={{
                    backgroundImage: "url('space.jpg')",
                  }}
                >
                  Buy Now
                </button>

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









// import React from 'react';
// import { handleCheckout } from '../stripe';


// const products = [
//   {
//   id: 'price_1PqGvWIzjW8CV',
//   name: 'Full Moon Album',
//   description: 'Produced by Tica Rey',
//   price: 9.99,
//   image: 'fullmoon.png',
//   },
//   {
//     id: 'price_1XXXXX',
//     name: 'UI/UX Designs',
//     description: 'Start Up UX/UI TailwindCSS Pack designed by Tica',
//     price: '$101.99',
//     image: '/UI-1.png',
//   },
//   {
//     id: 'price_1YYYYY',
//     name: ' Meditation mixtape',
//     description: 'Peace Mixtape produced by Tica Rey',
//     price: '$9.99',
//     image: '/peace_mixtape.png',
//   },
//   {
//     id: 'price_1YYYYY',
//     name: 'I AM Original Painting',
//     description: 'Original Exclusive 10x10 Painting by Tica Rey.',
//     price: '$7,777.00',
//     image: '/tica_paint.jpg',
//   },
//   {
//     id: 'price_1XXXXX',
//     name: 'Tica Custom Fashion',
//     description: 'Custom Designs by Tica Rey.',
//     price: '$29.99',
//     image: '/white_t.png',
//   },
//   {
//     id: 'price_1YYYYY',
//     name: '"I AM" Mug',
//     description: '"I Am" Tea or Coffee Mug',
//     price: '$15',
//     image: '/mug.png',
//   },

// ];

// const Shop = () => {
//   return (
//     <section className="min-h-screen bg-[#1f2227] flex flex-col "
    
//     >
//     {/* Hero Section */}
// <div
//   className="relative h-[400px] w-full bg-cover bg-center flex items-center justify-center"
//   style={{
//     backgroundImage: "url('/shop.png')",
//     backgroundSize: "70%",
//   }}
// >
//   {/* Overlay */}
//   <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />

//   {/* Text Content */}
//       {/* <div className="relative z-10 text-center px-4">
//       <h1 className="text-5xl md:text-6xl font-header mb-4 
//                     bg-clip-text text-transparent 
//                     bg-gradient-to-r from-blue-400 via-black-400 to-blue-400 
//                     drop-shadow-lg">
//         🛒 Tica's Shop
//       </h1>
//       <p className="text-base md:text-lg max-w-xl mx-auto font-body text-white drop-shadow-md">
//         Explore hand-crafted sound packs, visuals, and exclusive creative assets by Tica.
//       </p>
//     </div> */}

//         <div className="relative z-10 text-center px-4 py-16">
//   {/* Header */}
//      {/* bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 */}
//   <h1 className="text-4xl md:text-5xl font-extrabold mb-4text-6xl  font-header mb-6 
//                  bg-clip-text text-transparent 
//                  bg-white
             
//                  drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]
//                  animate-pulse">
//     🛒 Tica's Shop
//   </h1>

//   {/* Paragraph */}
//   <p className="text-lg md:text-2xl max-w-2xl mx-auto font-body text-white 
//                 drop-shadow-md tracking-wide leading-relaxed">
//     Explore <span className="text-[#a9d0de] font-semibold">hand-crafted sound packs</span>, 
//     <span className="text-white font-semibold"> visuals</span>, and 
//     <span className="text-[#a9d0de] font-semibold"> exclusive creative assets</span> by Tica.
//   </p>
// </div>



//       </div>


//       {/* Product Grid */}
//       <div className="max-w-7xl w-full mx-auto px-6 py-20 text-center flex-1  ">
//         <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        
         
//          ">
//           {products.map((product, index) => (
//             <div
//             key={index}
//             className="relative p-6 bg-[#0e0f10] object-cover mb-4
//             h-full w-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-900
//             rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
//           >
           
          
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full h-52 object-cover rounded-2xl"
//             />
          
//             <div className="p-4">
//               <h3 className="text-xl font-bold text-[#173767] dark:text-white">{product.name}</h3>
//               <p className="mt-1 text-sm text-gray-400">{product.description}</p>
//               <p className="mt-2 text-white dark:text-white">{product.price}</p>
//               <br />
//               <button
//                 onClick={() => handleCheckout(product.id)}
//                 className="px-6 py-4 text-white font-semibold rounded-lg shadow-[0_0_1px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-cover bg-center transition duration-300 transform hover:scale-105"
//                 style={{
//                   backgroundImage: "url('space.jpg')"
//                 }}
//               >
//                 Buy Now
//               </button>
//               <button
//                 className="absolute bottom-17 right-16 text-white text-xl hover:scale-110 transition"
//                 aria-label="Favorite"
//               >
//                 ❤️
//               </button>
//             </div>
//           </div>
          
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Shop;


