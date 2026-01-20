// src/components/Products.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { handleCheckout } from '../stripe';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/products`);
      setProducts(data.filter(p => p.visible));
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const categories = ['all', 'Music', 'Art', 'Film', 'Fashion', 'Original', 'Other'];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="shop" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">🛍 Tica's Shop</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Premium digital, custom art products and sounds made by Tica.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#335099] text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No products available.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-md"
                />
                
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">
                  {product.title}
                </h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Audio Preview for Digital Products */}
                {product.productType === 'digital' && product.fileKey && 
                 product.fileKey.match(/\.(mp3|wav|m4a|ogg)$/i) && (
                  <div className="mt-3 mb-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">🎵 Preview:</p>
                    <audio controls className="w-full" style={{ height: '32px' }}>
                      <source src={product.fileKey} type="audio/mpeg" />
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                )}
                
                <p className="text-lg font-bold text-gray-800 dark:text-white mt-3">
                  ${product.price}
                </p>
                
                <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {product.category}
                </span>
                
                <button
                  onClick={() => {
                    if (!product.priceId || product.priceId === '.99') {
                      alert('This product needs a Stripe Price ID. Please add one in the admin panel.');
                      return;
                    }
                    handleCheckout(product.priceId);
                  }}
                  className={`mt-4 w-full px-4 py-2 rounded transition ${
                    !product.priceId || product.priceId === '.99'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#335099] text-white hover:bg-[#233a66]'
                  }`}
                >
                  {!product.priceId || product.priceId === '.99' ? 'Price ID Required' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
