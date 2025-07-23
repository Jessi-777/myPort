// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Routes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail'; // New Project Detail page
import InvestorInfo from './components/InvestorInfo';
// import Investors from './pages/Investors.jsx';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import 'animate.css';

const App = () => {
  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Navbar */}
        <Navbar />
        <main className='flex-grow'>
        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home Page */}
          <Route path="/about" element={<About />} /> {/* About Page */}
          <Route path="/projects" element={<Projects />} /> {/* Projects Page */}
          <Route path="/projects/:projectId" element={<ProjectDetail />} /> {/* Dynamic project detail route */}
          <Route path="/shop" element={<Shop />} /> {/* Shop Page */}
          <Route path="/investors" element={<InvestorInfo />} /> {/* Investors Page */}
          <Route path="/contact" element={<Contact />} /> {/* Contact Page */}
        </Routes>
        </main>
        
        {/* Reusable Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
