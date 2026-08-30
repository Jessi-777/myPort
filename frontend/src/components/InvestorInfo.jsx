import React from 'react';
import { FaShoppingCart, FaSeedling, FaPaw, FaEnvelope, FaCalendar, FaRocket, FaChartLine, FaUsers } from 'react-icons/fa';

const InvestorInfo = () => {
  return (
    <section
      className="relative min-h-screen w-full bg-center bg-contain bg-no-repeat py-20 overflow-hidden"
  // style={{ backgroundImage: "url('blogo.png')" }}
    style={{ backgroundImage: "url('https://res.cloudinary.com/dk25jqckw/image/upload/v1781070678/blogo_kxcajs.png')" }}

  // style={{ backgroundImage: "url('https://res.cloudinary.com/dk25jqckw/image/upload/v1781070555/phone3_wxrrgx.png')" }}

    >
      
      {/* Dark gradient overlay - reduced opacity to show background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/70 to-[#2e333a]/60 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#96b9c6]/20 backdrop-blur-sm rounded-full mb-4 border border-[#96b9c6]/30">
            <span className="text-[#96b9c6] text-sm font-semibold">💼 Investment Opportunities</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Build the <span className="bg-gradient-to-r from-[#96b9c6] to-[#335099] bg-clip-text text-transparent">Future</span> With Us
          </h1>
          
          <p className="text-xl text-[#d9dae2] max-w-3xl mx-auto leading-relaxed">
            Explore unique opportunities to invest in four innovative businesses spanning 
            <span className="text-[#96b9c6]"> e-commerce</span>, 
            <span className="text-[#96b9c6]"> agriculture</span>, and 
            <span className="text-[#96b9c6]"> pet care</span> industries.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <FaRocket className="text-4xl text-[#96b9c6] mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">4</div>
            <div className="text-sm text-[#d9dae2]">Active Ventures</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <FaChartLine className="text-4xl text-[#96b9c6] mx-auto mb-3" />
            {/* <div className="text-3xl font-bold text-white">$1M</div> */}
            <div className="text-sm text-[#d9dae2]">Total Goal</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <FaUsers className="text-4xl text-[#96b9c6] mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">∞</div>
            <div className="text-sm text-[#d9dae2]">Impact Potential</div>
          </div>
        </div>

        {/* Investment Opportunities */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">

          {/* Pawfect PLug*/}
          <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="relative">

              <div className="w-16 h-16 bg-gradient-to-br from-[#96b9c6] to-[#335099] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              <img 
                src="/pawfect_plug_white.png" 
                
                alt="Pawfect Plug Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
              
              <div className="absolute top-0 right-0 bg-[#335099]/20 text-[#96b9c6] text-xs font-bold px-3 py-1 rounded-full">
                Pet Care 
              </div>
            </div>

             <h3 className="text-2xl font-bold text-white mb-3">Pawfect Plug</h3>
            <p className="text-[#d9dae2] mb-6 leading-relaxed">
              Revolutionizing pet care with personalized eco-friendly subscriptions. 
              Integrated platform connecting pet owners with local stores and data-driven recommendations.
            </p>
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                {/* <span className="text-sm text-[#d9dae2]">Investment Goal</span> */}
                {/* <span className="text-2xl font-bold text-[#96b9c6]">$327K</span> */}
              </div>
            </div>
          </div>


           {/* HNA App */}
          <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="relative">

              <div className="w-16 h-16 bg-gradient-to-br from-[#96b9c6] to-[#335099] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              <img 
                src="/hna-logo3 copy.png" 
                alt="HAN Logo" 
                className="w-30 h-30 object-contain"
              />
            </div>

              <div className="absolute top-0 right-0 bg-[#335099]/20 text-[#96b9c6] text-xs font-bold px-3 py-1 rounded-full">
                Athletic Clothing
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Human Nature Athletica</h3>
            <p className="text-[#d9dae2] mb-6 leading-relaxed">
           HNA blends performance wear, sustainability, and minimal luxury positioned to lead the next generation of conscious global brands.
            </p>
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                {/* <span className="text-sm text-[#d9dae2]">Investment Goal</span> */}
                {/* <span className="text-2xl font-bold text-[#96b9c6]">$320K</span> */}
              </div>
            </div>
          </div>


           {/* Farm App */}
          <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="relative">
               <div className="w-16 h-16 bg-gradient-to-br from-[#96b9c6] to-[#335099] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              <img 
                src="/farm-app.png" 
                alt="HAN Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
              <div className="absolute top-0 right-0 bg-[#335099]/20 text-[#96b9c6] text-xs font-bold px-3 py-1 rounded-full">
                AgriTech
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Farm App</h3>
            <p className="text-[#d9dae2] mb-6 leading-relaxed">
              Empowering farmers with tools for efficient garden beds to large crop growth. Plant disease detection, 
              water management, grow guidance, soil health, and community support revolutionizing local agriculture.
            </p>
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#d9dae2]">Investment Goal</span> 
               <span className="text-2xl font-bold text-[#96b9c6]">$175k</span> 
              </div>
            </div>
          </div>

          {/* Challego */}
          <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="relative">

               <div className="w-16 h-16 bg-gradient-to-br from-[#96b9c6] to-[#335099] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              <img 
                src="/challego_logo.png" 
                alt="HNA Logo" 
                className="w-13 h-13 object-contain"
              />
            </div>
              <div className="absolute top-0 right-0 bg-[#335099]/20 text-[#96b9c6] text-xs font-bold px-3 py-1 rounded-full">
                Ecommerce
              </div>
            </div>

             <h3 className="text-2xl font-bold text-white mb-3">Challego Online Market</h3>
            <p className="text-[#d9dae2] mb-6 leading-relaxed">
              A growing marketplace connecting local artisans and small businesses with wider audiences. 
              Disrupting traditional e-commerce while supporting local economies.
            </p>
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#d9dae2]">Investment Goal</span>
                <span className="text-2xl font-bold text-[#96b9c6]">$450K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#335099]/20 to-[#96b9c6]/10 backdrop-blur-sm rounded-2xl p-12 border border-[#96b9c6]/30 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make an <span className="text-[#96b9c6]">Impact</span>?
          </h2>
          <p className="text-xl text-[#d9dae2] mb-8 max-w-2xl mx-auto">
            Let's connect to discuss these opportunities. Schedule a call or request a pitch deck for detailed information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/jessisoftwareengineer/meeting-with-jessi-aka-tica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#96b9c6] to-[#335099] text-white font-semibold rounded-lg shadow-lg hover:shadow-[#96b9c6]/50 hover:scale-105 transition-all duration-300"
            >
              <FaCalendar /> Schedule a Meeting
            </a>
            <a
              href="mailto:jcsoftwareengineer369@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <FaEnvelope /> Contact Tica
            </a>
          </div>
           {/* Download Pitch Deck */}
            {/* <a
              href="/pitch-deck.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <FaDownload /> Download Pitch Deck
            </a> */}
        </div>
      </div>
    </section>
  );
};

export default InvestorInfo;
