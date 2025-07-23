



// src/components/Products.jsx
import React from 'react';
import { handleCheckout } from '../stripe';

const products = [
  {
    id: 'price_1XXXXX', // Replace with your Stripe price ID
    name: 'Study Beat Pack Vol. 1',
    price: '$14.99',
    image: '/tica.jpg',
  },
  {
    id: 'price_1YYYYY',
    name: 'Meditation Vol.1',
    price: '$9.99',
    image: '/tica.jpg',
  },
];

export default function Products() {
  return (
    <section id="shop" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">🛍 Tica’s Shop</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          Premium digital, custom art products and sounds made by Tica.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{product.price}</p>
              <button
                onClick={() => handleCheckout(product.id)}
                className="mt-4 px-4 py-2 bg-[#335099] text-white rounded hover:bg-[#233a66]"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
