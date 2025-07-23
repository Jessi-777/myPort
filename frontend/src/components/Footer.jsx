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
          <a href="https://www.linkedin.com/in/jessi-chavez-aka-tica-rey-33270231/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            Pawfect Plug
          </a>
          <a href="https://www.linkedin.com/in/jessi-chavez-aka-tica-rey-33270231/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            Challego Online Marketplace platform
          </a>
          <a href="https://www.linkedin.com/in/jessi-chavez-aka-tica-rey-33270231/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            Farm App
          </a>
          <a href="https://www.linkedin.com/in/jessi-chavez-aka-tica-rey-33270231/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            Expense Tracker App 
          </a>
          <a href="https://www.ticarey.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
            Tica Rey Music
          </a>
          <Link to="/contact" className="hover:text-gray-300 text-sm">
            Contact
          </Link>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="relative z-10 mt-6 text-center text-xs text-gray-300 border-t border-white/20 pt-4">
        &copy; 2025 Jessisoftwareengineer. All rights reserved. Built with ❤️ using MERN & Tailwind CSS.
      </div>
    </footer>
  );
};

export default Footer;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import logo from '/crown.png'; // adjust path if needed



// const Footer = () => {
//   return (
//     <footer className="bg-[#1f2227] text-white pt-10 pb-5">
      
//       <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
//         {/* Logo */}
//         <div className="mb-4 md:mb-0">
        
//           <Link to="/">
//             <img src={logo} alt="Tica Logo" className="h-10 w-auto" />
//           </Link>
//         </div>

//         {/* Links */}
//         <div className="flex space-x-6">
//           <a href="https://github.com/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
//             Pawfect Plug App
//           </a>
//           <a href="https://linkedin.com/in/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
//             Challego App
//           </a>
//           <a href="https://www.ticarey.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
//             Tica Rey Music
//           </a>
//           <a href="https://www.ticarey.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-sm">
//             SaaS App 2
//           </a>
//           <Link to="/contact" className="hover:text-gray-300 text-sm">
//             Contact
//           </Link>
//         </div>
//       </div>

//       {/* Bottom copyright */}
//       <div className="mt-6 text-center text-xs text-gray-300 border-t border-white/20 pt-4">
//         &copy; 2025 Jessisoftwareengineer. All rights reserved. Built with ❤️ using React & Tailwind CSS.
//       </div>
//     </footer>
//   );
// };

// export default Footer;




// import React from "react";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-6 mt-10">
//       <div className="max-w-6xl mx-auto px-4 text-center">
//         <p className="text-sm">
//           © {new Date().getFullYear()} TICA. All rights reserved.
//         </p>
//         <p className="text-xs text-gray-400 mt-1">
//           Built with ❤️ using React + TailwindCSS
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
