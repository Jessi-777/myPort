import React from 'react';
import { handleCheckout } from '../stripe';


const products = [
  {
    id: 'price_1YYYYY',
    name: 'Study at night music',
    description: 'Produced by Tica Rey.',
    price: '$9.99',
    image: 'fullmoon.png',
  },
  {
    id: 'price_1XXXXX',
    name: 'UI/UX Designs',
    description: 'An e-commerce platform built with React and Redux.',
    price: '$104.99',
    image: '/UI-1.png',
  },
  {
    id: 'price_1YYYYY',
    name: ' Peace meditation mixtape',
    description: 'Peace Mixtape',
    price: '$9.99',
    image: '/peace_mixtape.png',
  },

  {
    id: 'price_1YYYYY',
    name: 'Gems Art Album Painting',
    description: 'An e-commerce platform built with React and Redux.',
    price: '$1,250.00',
    image: '/tica_paint.jpg',
  },
  {
    id: 'price_1XXXXX',
    name: 'Tica Custom Fashion',
    description: 'An e-commerce platform built with React and Redux.',
    price: '$79.99',
    image: '/white_t.png',
  },
  {
    id: 'price_1YYYYY',
    name: 'Tica Rey Mug',
    description: 'Custom Coffee or Tea Mug',
    price: 'Donate',
    image: '/mug.png',
  },

];

const Shop = () => {
  return (
    <section className="min-h-screen bg-[#1f2227] flex flex-col "
    
    >
    {/* Hero Section */}
<div
  className="relative h-[400px] w-full bg-cover bg-center flex items-center justify-center"
  style={{
    backgroundImage: "url('/shop.png')",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />

  {/* Text Content */}
  <div className="relative z-10 text-center text-white px-4  ">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 ">🛒 Tica's Shop</h1>
    <p className="text-base md:text-lg max-w-xl mx-auto">
      Explore hand-crafted sound packs, visuals, and exclusive creative assets by Tica.
    </p>
  </div>
</div>


      {/* Product Grid */}
      <div className="max-w-7xl w-full mx-auto px-6 py-20 text-center flex-1  ">
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        
         
         ">
          {products.map((product, index) => (
            <div
            key={index}
            className="relative p-6 bg-[#0e0f10] object-cover mb-4
            h-full w-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-900
            rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
          >
           
          
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-52 object-cover rounded-2xl"
            />
          
            <div className="p-4">
              <h3 className="text-xl font-bold text-[#173767] dark:text-white">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{product.description}</p>
              <p className="mt-2 text-white dark:text-white">{product.price}</p>
              <br />
              <button
                onClick={() => handleCheckout(product.id)}
                className="px-6 py-4 text-white font-semibold rounded-lg shadow-[0_0_1px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-cover bg-center transition duration-300 transform hover:scale-105"
                style={{
                  backgroundImage: "url('space.jpg')"
                }}
              >
                Buy Now
              </button>
              <button
                className="absolute bottom-17 right-16 text-white text-xl hover:scale-110 transition"
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

