// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/shop", label: "Shop" },
  { path: "/investors", label: "Investor Info" },
  { path: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="bg-[#1f2227] text-white p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* LOGO — unchanged */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold" onClick={() => setMenuOpen(false)}>
            <img src="/crown.png" alt="Logo" className="h-16 w-16 object-contain" />
          </Link>

          {/* DESKTOP LINKS — unchanged */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-[#F1F1F1] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* HAMBURGER — mobile only */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block w-6 h-0.5 bg-white rounded transition-transform duration-300 origin-center
                ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white rounded transition-all duration-200
                ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white rounded transition-transform duration-300 origin-center
                ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out bg-[#1f2227]
          ${menuOpen ? "max-h-[600px]" : "max-h-0"}`}
      >
        <div className="px-6 pb-7 pt-0">

          {/* gradient rule */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#96b9c6] to-transparent opacity-50 mb-6" />

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group rounded-xl">
                {/* glow layer */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#96b9c6] to-[#335099] rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-400 pointer-events-none" />

                <Link
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`relative z-10 flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-250
                    ${location.pathname === link.path
                      ? "text-white bg-white/[0.06]"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                  {/* dot accent */}
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#96b9c6] to-[#335099] opacity-70 shrink-0" />
                  <span className="text-[17px] font-medium tracking-[0.01em]">{link.label}</span>
                  <span className={`ml-auto text-sm transition-all duration-200 group-hover:translate-x-0.5
                    ${location.pathname === link.path ? "text-[#96b9c6]" : "text-white/20 group-hover:text-[#96b9c6]"}`}>
                    ›
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="relative group mt-5 rounded-2xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#96b9c6] to-[#335099] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="relative z-10 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
                bg-gradient-to-r from-[#96b9c6]/10 to-[#335099]/15
                border border-[#96b9c6]/20 text-white text-[13px] font-semibold tracking-widest uppercase
                hover:from-[#96b9c6]/15 hover:to-[#335099]/25 transition-all duration-300"
            >
              Connect with TICA →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;



// // src/components/Navbar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="bg-[#1f2227] text-white p-6">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         {/* <Link to="/" className="text-2xl font-bold">TIC/\</Link> */}
//         <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
//           <img src="/crown.png" alt="Logo" className="h-16 w-16 object-contain" />
//             {/* <span>TICA Systems</span> */}
//             {/* <span>Tech.Design.Music.Film</span> */}
//              {/* <span>Full Stack Softw/\re Developer | Design | Music & Film</span> */}
//               {/* <span>Tech.Tunes.Film</span> */}
//         </Link>

//         <div className="space-x-6">
//           <Link to="/" className="hover:text-[#F1F1F1]">Home</Link>
//           <Link to="/about" className="hover:text-[#F1F1F1]">About</Link>
//           <Link to="/projects" className="hover:text-[#F1F1F1]">Projects</Link>
//           <Link to="/shop" className="hover:text-[#F1F1F1]">Shop</Link>
//           <Link to="/investors" className="hover:text-[#F1F1F1]">Investor Info</Link>
//           {/* className="bg-[#173767] text-white px-4 py-2 rounded hover:bg-[#1e4a92] transition">Investor Info</a> */}
//           <Link to="/contact" className="hover:text-[#F1F1F1]">Contact</Link>
//            {/* <Link to="/music" className="hover:text-[#F1F1F1]">Music</Link> */}
//         </div>
     
//       </div>
//     </nav>
//   );
// };

// export default Navbar;







// // src/components/Navbar.jsx
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";

// const navLinks = [
//   { path: "/", label: "Home" },
//   { path: "/about", label: "About" },
//   { path: "/projects", label: "Projects" },
//   { path: "/shop", label: "Shop" },
//   { path: "/investors", label: "Investor Info" },
//   { path: "/contact", label: "Contact" },
// ];

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation();

//   const isActive = (path) => location.pathname === path;

//   return (
//     <>
//       {/* ── NAV BAR ── */}
//       <nav className="sticky top-0 z-50 bg-[#13151a]/85 backdrop-blur-xl border-b border-white/[0.07] text-white">
//         <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

//           {/* LOGO */}
//           <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setMenuOpen(false)}>
//             <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#e8d5a0] to-[#c9a84c] flex items-center justify-center shadow-[0_0_20px_rgba(232,213,160,0.25)] shrink-0">
//               <img src="/crown.png" alt="TICA" className="h-5 w-5 object-contain" />
//             </div>
//             <div className="hidden sm:flex flex-col leading-tight">
//               <span className="font-['Syne',sans-serif] text-[15px] font-bold tracking-[0.06em] text-[#f5f5f5]">
//                 TICA Global Systems
//               </span>
//               <span className="font-mono text-[9px] font-light tracking-[0.14em] uppercase text-[#e8d5a0]">
//                 Tech · Design · Film
//               </span>
//             </div>
//           </Link>

//           {/* DESKTOP NAV */}
//           <div className="hidden md:flex items-center gap-0.5">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`relative px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase rounded-md transition-all duration-200
//                   ${isActive(link.path)
//                     ? "text-[#e8d5a0] bg-[rgba(232,213,160,0.12)]"
//                     : "text-[#6b7280] hover:text-white hover:bg-white/[0.04]"
//                   }`}
//               >
//                 {link.label}
//                 {isActive(link.path) && (
//                   <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#e8d5a0] rounded-t-sm" />
//                 )}
//               </Link>
//             ))}

//             {/* CTA */}
//             <Link
//               to="/contact"
//               className="ml-3 px-4 py-[7px] bg-[#e8d5a0] text-[#0e1015] font-mono text-[10px] tracking-[0.1em] uppercase rounded-md hover:opacity-85 hover:-translate-y-px transition-all duration-150"
//             >
//               Connect →
//             </Link>
//           </div>

//           {/* HAMBURGER */}
//           <button
//             className={`md:hidden flex flex-col justify-center gap-[5px] w-9 h-9 border rounded-lg p-2 transition-colors duration-200
//               ${menuOpen ? "border-white/20" : "border-white/[0.07]"}`}
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label={menuOpen ? "Close menu" : "Open menu"}
//           >
//             <span className={`block w-full h-[1.5px] bg-white rounded-sm origin-center transition-transform duration-300
//               ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
//             <span className={`block w-full h-[1.5px] bg-white rounded-sm transition-all duration-200
//               ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
//             <span className={`block w-full h-[1.5px] bg-white rounded-sm origin-center transition-transform duration-300
//               ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
//           </button>
//         </div>
//       </nav>

//       {/* ── OVERLAY ── */}
//       <div
//         className={`fixed inset-0 top-[68px] bg-black/50 z-40 transition-opacity duration-300 md:hidden
//           ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
//         onClick={() => setMenuOpen(false)}
//       />

//       {/* ── SLIDE-IN DRAWER ── */}
//       <div
//         className={`fixed top-[68px] right-0 h-[calc(100vh-68px)] w-[min(320px,85vw)] bg-[#1a1d24] border-l border-white/[0.07]
//           flex flex-col px-7 py-8 z-50 transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden
//           ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#6b7280] mb-4 pb-2 border-b border-white/[0.07]">
//           Navigation
//         </p>

//         <div className="flex flex-col">
//           {navLinks.map((link) => (
//             <Link
//               key={link.path}
//               to={link.path}
//               onClick={() => setMenuOpen(false)}
//               className={`flex items-center justify-between py-3.5 text-lg font-semibold border-b border-white/[0.07] last:border-none
//                 transition-all duration-200 hover:pl-1
//                 ${isActive(link.path) ? "text-[#e8d5a0]" : "text-[#6b7280] hover:text-white"}`}
//             >
//               {link.label}
//               <span className={`text-xs transition-colors duration-200 ${isActive(link.path) ? "text-[#e8d5a0]" : "text-white/10"}`}>
//                 →
//               </span>
//             </Link>
//           ))}
//         </div>

//         <div className="mt-auto pt-6 border-t border-white/[0.07]">
//           <Link
//             to="/contact"
//             onClick={() => setMenuOpen(false)}
//             className="block w-full py-3.5 text-center bg-[#e8d5a0] text-[#0e1015] font-mono text-[11px] tracking-[0.12em] uppercase rounded-lg hover:opacity-85 transition-opacity duration-150"
//           >
//             Connect With TICA →
//           </Link>
//           <p className="font-mono text-[9px] text-[#6b7280] tracking-[0.1em] text-center mt-3.5">
//             Tech · Design · Music · Film · Global
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;



// // src/components/Navbar.jsx

// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation();

//   const navLinks = [
//     { path: "/", label: "Home" },
//     { path: "/about", label: "About" },
//     { path: "/projects", label: "Projects" },
//     { path: "/shop", label: "Shop" },
//     { path: "/investors", label: "Investor Info" },
//     { path: "/contact", label: "Contact" },
//   ];

//   return (
//     <nav className="sticky top-0 z-50 bg-[#1f2227]/90 backdrop-blur-md border-b border-white/10 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6">
//         <div className="flex items-center justify-between h-20">

//           {/* LOGO */}
//           <Link
//             to="/"
//             className="flex items-center gap-3 font-bold tracking-wide"
//           >
//             <img
//               src="/crown.png"
//               alt="Logo"
//               className="h-12 w-12 object-contain"
//             />

//             <div className="hidden sm:flex flex-col leading-tight">
//               <span className="text-lg">TICA Global Systems</span>
//               <span className="text-xs text-gray-400">
//                 Tech • Design • Film
//               </span>
//             </div>
//           </Link>

//           {/* DESKTOP NAV */}
//           <div className="hidden md:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`transition duration-300 hover:text-gray-300 relative ${
//                   location.pathname === link.path
//                     ? "text-white"
//                     : "text-gray-400"
//                 }`}
//               >
//                 {link.label}

//                 {location.pathname === link.path && (
//                   <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-white rounded-full" />
//                 )}
//               </Link>
//             ))}
//           </div>

//           {/* MOBILE BUTTON */}
//           <button
//             className="md:hidden"
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             {menuOpen ? (
//               <X size={30} />
//             ) : (
//               <Menu size={30} />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE MENU */}
//       <div
//         className={`md:hidden overflow-hidden transition-all duration-300 ${
//           menuOpen ? "max-h-[500px]" : "max-h-0"
//         }`}
//       >
//         <div className="bg-[#181b20] border-t border-white/10 px-6 py-4 flex flex-col space-y-5">

//           {navLinks.map((link) => (
//             <Link
//               key={link.path}
//               to={link.path}
//               onClick={() => setMenuOpen(false)}
//               className={`text-lg transition ${
//                 location.pathname === link.path
//                   ? "text-white"
//                   : "text-gray-400"
//               } hover:text-white`}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




