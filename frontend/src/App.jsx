// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { trackPageView } from "./utils/analytics";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import InvestorInfo from "./components/InvestorInfo";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Downloads from "./pages/Downloads";
import Admin from "./pages/Admin";

import "animate.css";

/* ============================================================
   PUBLIC SITE LAYOUT
============================================================ */

function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

/* ============================================================
   ADMIN LAYOUT
   Keeps admin completely separate from public website UI.
============================================================ */

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#050509] text-white">
      <Outlet />
    </div>
  );
}

/* ============================================================
   APP
============================================================ */

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ======================================================
            PUBLIC WEBSITE
        ====================================================== */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/projects" element={<Projects />} />

          <Route
            path="/projects/:projectId"
            element={<ProjectDetail />}
          />

          <Route path="/shop" element={<Shop />} />

          <Route
            path="/investors"
            element={<InvestorInfo />}
          />

          <Route path="/contact" element={<Contact />} />

          <Route path="/success" element={<Success />} />

          <Route path="/downloads" element={<Downloads />} />

          <Route path="/cancel" element={<Cancel />} />
        </Route>

        {/* ======================================================
            ADMIN
        ====================================================== */}

        <Route element={<AdminLayout />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>

        {/* ======================================================
            FALLBACK
        ====================================================== */}

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-[#050509] text-white">
              <div className="text-center px-6">
                <h1 className="text-6xl font-black mb-4">
                  404
                </h1>

                <p className="text-gray-400 mb-6">
                  The page you're looking for doesn't exist.
                </p>

                <a
                  href="/"
                  className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
                >
                  Back to Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;






// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Routes
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import About from './pages/About';
// import Projects from './pages/Projects';
// import ProjectDetail from './pages/ProjectDetail'; // New Project Detail page
// import InvestorInfo from './components/InvestorInfo';
// // import Investors from './pages/Investors.jsx';
// import Shop from './pages/Shop';
// import Contact from './pages/Contact';
// import 'animate.css';
// import Success from './pages/Success';
// import Cancel from './pages/Cancel';
// import Admin from './pages/Admin';
// // import MusicPlayer from './pages/MusicPlayer';

// // inside <Routes>




// const App = () => {
//   return (
//     <Router>
//       <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
//         {/* Navbar */}
//         <Navbar />
//         <main className='flex-grow'>
//         {/* Routes for different pages */}
//         <Routes>
//           <Route path="/" element={<Home />} /> {/* Home Page */}
//           <Route path="/about" element={<About />} /> {/* About Page */}
//           <Route path="/projects" element={<Projects />} /> {/* Projects Page */}
//           <Route path="/projects/:projectId" element={<ProjectDetail />} /> {/* Dynamic project detail route */}
//           <Route path="/shop" element={<Shop />} /> {/* Shop Page */}
//           <Route path="/investors" element={<InvestorInfo />} /> {/* Investors Page */}
//           <Route path="/contact" element={<Contact />} /> {/* Contact Page */}
//           <Route path="/success" element={<Success />} />
//           <Route path="/cancel" element={<Cancel />} />
//           <Route path="/admin" element={<Admin />} />
//           {/* <Route path="/music" element={<MusicPlayer />} /> Music Player Page */}

//         </Routes>
//         </main>
        
//         {/* Reusable Footer */}
//         <Footer />
//       </div>
//     </Router>
//   );
// };

// export default App;
