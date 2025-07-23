
// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#1f2227] text-white p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* <Link to="/" className="text-2xl font-bold">TIC/\</Link> */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          {/* <img src="/" alt="Logo" className="h-8 w-8 object-contain" /> */}
            <span>Jessi aka TICA</span>
        </Link>

        <div className="space-x-6">
          <Link to="/" className="hover:text-[#F1F1F1]">Home</Link>
          <Link to="/about" className="hover:text-[#F1F1F1]">About</Link>
          <Link to="/projects" className="hover:text-[#F1F1F1]">Projects</Link>
          <Link to="/shop" className="hover:text-[#F1F1F1]">Shop</Link>
          <Link to="/investors" className="hover:text-[#F1F1F1]">Investor Info</Link>
          {/* className="bg-[#173767] text-white px-4 py-2 rounded hover:bg-[#1e4a92] transition">Investor Info</a> */}
          <Link to="/contact" className="hover:text-[#F1F1F1]">Contact</Link>
        </div>
     
      </div>
    </nav>
  );
};

export default Navbar;

