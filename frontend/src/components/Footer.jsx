import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/crown.png'; // adjust path if needed

const Footer = () => {
  return (
    <footer className="bg-[#1f2227] text-white pt-10 pb-5">
    {/* // <footer className="relative text-white pt-10 pb-5 bg-[url('/space.jpg')] bg-cover bg-center"> */}
      {/* Optional overlay for contrast */}
      {/* <div className="absolute inset-0 bg-black/60 z-0" /> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <Link to="/">
            <img src={logo} alt="Tica Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center space-x-6">
          <a href="https://pawfectplug.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            Pawfect Plug
          </a>
          {/* <a href="https://challego.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            Challego Online Marketplace platform
          </a> */}
          <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            HNA Human Nature Atheltica
          </a>
           {/* <a href="https://jessisoftwareengineer.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            Farm App
          </a> */}
          <a href="https://www.ticarey.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            Tica Rey Music
          </a>
          
          {/* <Link to="/contact" className="hover:text-gray-300 text-sm">
            Contact
          </Link> */}
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="relative z-10 mt-6 text-center text-xs text-gray-300 border-t border-white/20 pt-4">
        &copy; {new Date().getFullYear()}  All rights reserved. Built by TICA Global Systems with ❤️ using MERN & Tailwind CSS.
      </div>
    </footer>
  );
};

export default Footer;

