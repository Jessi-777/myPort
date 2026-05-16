import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaPalette, FaRocket, FaArrowRight } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section
      className="relative py-20 bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/black.jpg')" }}
    >
      {/* Dark gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/95 to-[#2e333a]/90 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center gap-25 mb-16">
          {/* Image Section with Gradient Border */}
          <div className="flex-1 mb-10 md:mb-0">
            <div className="relative group">
              <div className="absolute -left-4 top-0 bottom-0 w-[110%] 
                bg-gradient-to-r from-[#96b9c6] to-[#335099] 
                rounded-2xl blur-xl opacity-25 
                group-hover:opacity-50 transition duration-500"></div>
              <img
                // src="https://res.cloudinary.com/ninjagrvl/image/upload/v1778135009/wdjih8nri7zs2w3vjyca.png"
                src='https://res.cloudinary.com/ninjagrvl/image/upload/v1778891381/nl6awplmlb1soypsdsue.jpg'
                //  src="/tica2.jpg"
                alt="Tica business photo"
                className="relative max-w-lg w-full mx-auto md:mx-0 rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-4 py-2 bg-[#96b9c6]/20 backdrop-blur-sm rounded-full mb-4 border border-[#96b9c6]/30">
              <span className="text-[#96b9c6] text-sm font-semibold">✨ Open to Opportunities</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Who is <span className="bg-gradient-to-r from-[#96b9c6] to-[#335099] bg-clip-text text-transparent">T!CA</span>?
            </h2>

            <h3 className="text-xl lg:text-2xl font-semibold text-[#96b9c6] mb-6">
              Software Engineer • Developer • Designer • Founder 
            </h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-[#96b9c6]/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5+</div>
                <div className="text-sm text-[#d9dae2]">Years Exp</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5+</div>
                <div className="text-sm text-[#d9dae2]">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">∞</div>
                <div className="text-sm text-[#d9dae2]">Ideas</div>
              </div>
            </div>

            <p className="text-[#d9dae2] text-lg leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0">
              <span className="text-white font-semibold">I'm a builder at heart</span>, an engineer who designs with intention and creates with purpose. 
              From <span className="text-[#96b9c6]">scalable architecture</span> to <span className="text-[#96b9c6]">pixel-perfect interfaces</span>, 
              I design and develop every layer with care and clarity.
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#96b9c6] to-[#335099] text-white font-semibold rounded-lg shadow-lg hover:shadow-[#96b9c6]/50 hover:scale-105 transition-all duration-300"
            >
              Learn More <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* Skills Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
              <FaCode className="text-2xl text-[#96b9c6]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Full Stack Development</h3>
            <p className="text-[#d9dae2]">React, Node.js, MongoDB, Express, REST APIs</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
              <FaPalette className="text-2xl text-[#96b9c6]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">UI/UX Design</h3>
            <p className="text-[#d9dae2]">Figma, Adobe Suite, Responsive Design</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
              <FaRocket className="text-2xl text-[#96b9c6]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Product Thinking</h3>
            <p className="text-[#d9dae2]">MVP Strategy, Agile, User Stories</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
