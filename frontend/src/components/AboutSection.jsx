import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCode,
  FaPalette,
  FaRocket,
  FaArrowRight,
} from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section
      className="relative py-20 bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/black.jpg')" }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/95 to-[#2e333a]/90 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center gap-16 mb-16">

          {/* Image */}
          <div className="flex-1 mb-10 md:mb-0">
            <div className="relative group">
              <div
                className="
                  absolute -inset-1
                  bg-gradient-to-r from-[#96b9c6] to-[#335099]
                  rounded-2xl blur
                  opacity-25
                  group-hover:opacity-50
                  transition duration-500
                "
              ></div>

              <img
                src="https://res.cloudinary.com/ninjagrvl/image/upload/v1778891381/nl6awplmlb1soypsdsue.jpg"
                alt="Jessi Chavez — full-stack software engineer and product builder"
                className="
                  relative
                  max-w-lg
                  w-full
                  mx-auto
                  md:mx-0
                  rounded-2xl
                  shadow-2xl
                  transform
                  group-hover:scale-105
                  transition
                  duration-500
                "
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">

            {/* Availability */}
            <div className="inline-block px-4 py-2 bg-[#96b9c6]/20 backdrop-blur-sm rounded-full mb-4 border border-[#96b9c6]/30">
              <span className="text-[#96b9c6] text-sm font-semibold">
                ✨ Open to Opportunities
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Who is{' '}
              <span className="bg-gradient-to-r from-[#96b9c6] to-[#335099] bg-clip-text text-transparent">
                T!CA
              </span>
              ?
            </h2>

            <h3 className="text-xl lg:text-2xl font-semibold text-[#96b9c6] mb-6">
              FULL-STACK SOFTWARE ENGINEER
              <br />
              PRODUCT BUILDER • CREATIVE TECHNOLOGIST
            </h3>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-[#96b9c6]/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">6+</div>
                <div className="text-sm text-[#d9dae2]">
                  Years Building
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-white">6+</div>
                <div className="text-sm text-[#d9dae2]">
                  Projects Built
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  End-to-End
                </div>
                <div className="text-sm text-[#d9dae2]">
                  Product Ownership
                </div>
              </div>
            </div>

            {/* Intro */}
            <p className="text-[#d9dae2] text-lg leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0">
              <span className="text-white font-semibold">
                I'm a builder at heart
              </span>
              , an engineer who designs with intention and creates with purpose.
              From scalable architecture to refined interfaces, I design and
              build digital products from concept to production, combining
              software engineering, UI/UX, and creative technology.
            </p>

            {/* CTA */}
            <Link
              to="/about"
              className="
                inline-flex
                items-center
                gap-2
                px-8
                py-3
                bg-gradient-to-r
                from-[#96b9c6]
                to-[#335099]
                text-white
                font-semibold
                rounded-lg
                shadow-lg
                hover:shadow-[#96b9c6]/50
                hover:scale-105
                transition-all
                duration-300
              "
            >
              Explore My Story
              <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* Capability Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Engineering */}
          <div
            className="
              bg-white/5
              backdrop-blur-sm
              rounded-xl
              p-6
              border
              border-white/10
              hover:border-[#96b9c6]/50
              transition-all
              duration-300
              hover:scale-105
            "
          >
            <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
              <FaCode className="text-2xl text-[#96b9c6]" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Full-Stack Engineering
            </h3>

            <p className="text-[#d9dae2]">
              React, Node.js, Express, MongoDB, PostgreSQL, REST APIs,
              authentication, RBAC, Stripe, and production deployment.
            </p>
          </div>

          {/* Design */}
          <div
            className="
              bg-white/5
              backdrop-blur-sm
              rounded-xl
              p-6
              border
              border-white/10
              hover:border-[#96b9c6]/50
              transition-all
              duration-300
              hover:scale-105
            "
          >
            <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
              <FaPalette className="text-2xl text-[#96b9c6]" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              UI/UX & Design
            </h3>

            <p className="text-[#d9dae2]">
              Figma, responsive interfaces, visual design, interaction design,
              branding, and user-centered experiences.
            </p>
          </div>

          {/* Product */}
          <div
            className="
              bg-white/5
              backdrop-blur-sm
              rounded-xl
              p-6
              border
              border-white/10
              hover:border-[#96b9c6]/50
              transition-all
              duration-300
              hover:scale-105
            "
          >
            <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
              <FaRocket className="text-2xl text-[#96b9c6]" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Product Engineering
            </h3>

            <p className="text-[#d9dae2]">
              Product strategy, architecture, MVP development, SaaS,
              e-commerce, integrations, and end-to-end product ownership.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

