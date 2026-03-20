import React from 'react';
import { FaGithub, FaLinkedin, FaCode, FaPalette, FaRocket, FaDownload } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const About = () => {
  return (
    <section
      className="relative py-20 bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/black.jpg')" }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/95 to-[#2e333a]/90 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          {/* Image Left with hover effect */}
          <div className="flex-1 mb-10 md:mb-0">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#96b9c6] to-[#335099] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <img
                src="/tica1.jpg"
                alt="Tica working"
                className="relative w-full max-w-lg mx-auto md:mx-0 rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Text Right */}
          <div className="flex-1 text-center md:text-left">
            {/* <div className="inline-block px-2 py-2 bg-[#96b9c6]/20 rounded-full mb-4">
              <span className="text-[#96b9c6] text-sm font-semibold">✨ Open to Opportunities</span>
            </div> */}
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Tica aka Jessi
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-[#96b9c6] mb-6">
              Software Engineer • Developer • Designer • Founder 
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-[#96b9c6]/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5+</div>
                <div className="text-sm text-[#d9dae2]">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5+</div>
                <div className="text-sm text-[#d9dae2]">Projects Built</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">∞</div>
                <div className="text-sm text-[#d9dae2]">Ideas Created</div>
              </div>
            </div>
{/* I design and build systems so they feel inevitable—clear, intentional, and easy to trust. */}
           <div className="space-y-4 text-lg text-[#d9dae2] leading-relaxed mb-8">
            <p>
              <span className="text-white font-semibold">I build platforms with intention</span>, focusing on clarity, usability, and long-term reliability.
              My work is rooted in thoughtful engineering designing systems that are easy to understand, operate, and trust.
            </p>
            <p>
              I approach each project by aligning strategy, architecture, and interface designs for the best UX/UI user experience.
              This allows me to build scalable full stack systems and refined interfaces that feel effortless from the inside out.
            </p>
            <p>
              Whether developing full scale applications or ecommerce platforms, I bring a balanced perspective combining
              <span className="text-white font-semibold"> technical depth</span>,
              <span className="text-white font-semibold"> design sensibility</span>, and
              <span className="text-white font-semibold"> strategic thinking</span> to create platforms built to last.
            </p>
          </div>



            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="https://calendly.com/jessisoftwareengineer/meeting-with-jessi-aka-tica"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#32353b] text-white font-semibold rounded-lg shadow-lg hover:bg-[#96b9c6] hover:scale-105 transition-all duration-300"
              >
                📅 Schedule a Meeting
              </a>
              <a
                href="/jessi-resume-2026.pdf"
                download="Jessi-Chavez-Resume-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <FaDownload /> Download Resume
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://github.com/Jessi-777"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#96b9c6] hover:scale-110 transition-all duration-300 text-xl"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/jessi-chavez-aka-tica-rey-33270231/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#96b9c6] hover:scale-110 transition-all duration-300 text-xl"
              >
                <FaLinkedin />
              </a>
              <a
                             href="https://x.com/IamTicaRey"
                             target="_blank"
                             rel="noopener noreferrer"
                             className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#96b9c6] hover:scale-110 transition-all duration-300"
                           >
                             <FaXTwitter className="text-xl" />
                           </a>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
              <FaCode className="text-2xl text-[#96b9c6]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Full Stack Development</h3>
            <p className="text-[#d9dae2]">React, Node.js, MongoDB, Express, REST APIs, GraphQL, Python, Django , PostgreSQL</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
              <FaPalette className="text-2xl text-[#96b9c6]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">UI/UX Design</h3>
            <p className="text-[#d9dae2]">Figma, Adobe Suite, Responsive Design, User Research</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
              <FaRocket className="text-2xl text-[#96b9c6]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Product Thinking</h3>
            <p className="text-[#d9dae2]">MVP Strategy, Agile, User Stories, Growth Mindset</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
