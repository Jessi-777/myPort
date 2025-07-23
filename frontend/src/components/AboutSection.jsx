import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section
      className="relative py-20 bg-center bg-cover bg-no-repeat bg-gradient-to-r from-[#2e333a] to-[#7e8f9d]"
      style={{ backgroundImage: "url('/black.jpg')" }} // replace with your actual image path
    >
      {/* Subtle gradient overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-[#808b9c] to-[#c5c9d0] opacity-30"></div> */}

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Image Section */}
        <div className="flex-1">
          <img
            src="/tica1.jpg"
            alt="Tica working"
            className="w-full max-w-sm mx-auto md:mx-0 rounded-lg shadow-2xl hover:scale-105 transition duration-500 ease-in-out"
          />
        </div>

        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Who is <span className="text-[#96b9c6]">T!CA</span>?
          </h2>

          <h3 className="text-xl lg:text-2xl font-semibold text-[#96b9c6] mb-6">
            Software Engineer • Developer • Designer • Founder
          </h3>

          <p className="text-[#d9dae2] text-lg leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0">
            Hi, I build with purpose blending engineering, UI/UX, and storytelling to create seamless digital experiences. 
            From scalable apps to polished interfaces, I design and develop every layer with care and clarity.
          </p>

          <Link
            to="/about"
            className="px-6 py-3 border-2 border-[#96b9c6] text-[#96b9c6] rounded-lg hover:text-white transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;



// import React from 'react';
// import { Link } from 'react-router-dom';

// const AboutSection = () => {
//   return (
//         <section className="relative py-20 bg-gradient-to-r from-[#1f2227] to-[#7e8f9d]">
//       {/* Background gradient shape */}
//       <div className="absolute inset-0 bg-gradient-to-r from-[#1F3A5A] to-[#173767] opacity-10"></div>

//       <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
//         {/* Image Section */}
//         <div className="flex-1">
//           <img
//             src="/tica1.jpg"
//             alt="Tica working"
//             className="w-full max-w-sm mx-auto md:mx-0 rounded-lg shadow-2xl hover:scale-105 transition duration-500 ease-in-out"
//           />
//         </div>

//         {/* Text Section */}
//         <div className="flex-1 text-center md:text-left">
//           <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
//             Who is <span className="text-[rgb(25,28,29)]">T!CA</span>?
//           </h2>

//           <h3 className="text-xl lg:text-2xl font-semibold text-[#96b9c6] mb-6">
//             Software Engineer • Developer • Designer • Founder
//           </h3>

//           <p className="text-[#d9dae2] text-lg leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0">
//             Hi, I build with purpose blending engineering, UI/UX, and storytelling to create seamless digital experiences. From scalable apps to polished interfaces, I design and develop every layer with care and clarity.
//           </p>

//           <Link
//             to="/about"
//             className="
//             px-6 py-3 border-2 border-[#96b9c6] text-[#96b9c6] rounded-lg hover:text-white transition duration-300"
//           >
//             Learn More
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;


// import React from 'react';
// import { Link } from 'react-router-dom'; // Make sure react-router-dom is installed

// const AboutSection = () => {
//   return (
//     <section className="relative py-20 bg-gradient-to-r from-[#1f2227] to-[#2c344e]">
//       {/* Background gradient shape */}
//       <div className="absolute inset-0 bg-gradient-to-r from-[#1F3A5A] to-[#173767] opacity-10"></div>

//       <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
//         {/* Left - Image */}
//         <div className="flex-1 mb-8 md:mb-0 md:mr-8">
//           <img
//             src="/tica1.jpg"
//             alt="Tica working"
//             className="w-full max-w-sm mx-auto md:mx-0 rounded-2xl shadow-lg"
//           />
//         </div>

//         {/* Right - Text */}
//         <div className="flex-1 text-center md:text-left">
//           <h2 className="text-5xl font-bold text-white mb-6">About Me</h2>
//           <h3 className="text-2xl font-semibold text-white mb-4">
//             Full Stack Software Engineer | Developer | UI/UX Designer | Founder
//           </h3>
//           <p className="text-lg text-[#d9dae2] mb-6 max-w-2xl mx-auto md:mx-0">
//             I build with purpose blending engineering, UI/UX, and storytelling to create seamless digital experiences. From scalable apps to polished interfaces, I design and develop every layer with care and clarity.
//           </p>
//           <Link
//             to="/about"
//             className="inline-block text-[#cf951a] font-medium hover:underline transition duration-200"
//           >
//             Learn more →
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;

// import React from 'react';

// const AboutSection = () => {
//   return (
//     <section className="relative py-20 bg-gradient-to-r from-[#1f2227] to-[#2c344e]">
//       {/* Background Shapes for visual appeal */}
//       <div className="absolute inset-0 bg-gradient-to-r from-[#1F3A5A] to-[#173767] opacity-10"></div>

//       <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
//         {/* Left side - Image */}
//         <div className="flex-1 mb-8 md:mb-0 md:mr-8">
//           <img
//             src="/tica1.jpg" // Ensure the image is in the public folder
//             alt="Tica working"
//             className="w-full max-w-sm mx-auto md:mx-0 rounded-2xl shadow-lg"
//           />
//         </div>

//         {/* Right side - About Me text */}
//         <div className="flex-1 text-center md:text-left">
//           <h2 className="text-5xl font-bold text-white mb-6 animate__animated animate__fadeIn">
//             About Me
//           </h2>
//            {/* Skills/Text Block */}
//            <h3 className="text-2xl font-semibold text-white mb-6">
//             Full Stack Software Engineer | Developer | UI/UX Designer
//           </h3>
//           <p className="text-xl text-[#d9dae2] mb-8 mx-auto max-w-3xl animate__animated animate__fadeIn animate__delay-1s">
//           I'm a builder at heart, an engineer who designs with intention and creates with purpose. With a foundation in full stack development, UI/UX design, and visual storytelling, I craft digital experiences that are as functional as they are beautiful. From scalable backend architecture to pixel-perfect interfaces, I make sure every layer of a product feels seamless and userfocused. I'm not afraid to take on complex challenges, explore bold ideas, or build from scratch. Whether it's launching full-scale applications, improving user flows, or shaping product direction, I bring both the technical depth and design sensibility to move fast and build smart. I'm always learning, tuning, and evolving, because innovation demands it. If you're looking for someone who can think like a developer, design like an artist, and execute like a founder, I'm ready to bring that vision to life. I'm a builder at heart, an engineer who designs with intention and creates with purpose.
//         </p>

        

         
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;





// // src/components/AboutSection.jsx
// import React from 'react';

// const AboutSection = () => {
//   return (
//     <section className="relative py-20 bg-gradient-to-r from-[#F7F8F9] to-[#E6EFF5]">
//       {/* Background Shapes for visual appeal */}
//       <div className="absolute inset-0 bg-gradient-to-r from-[#1F3A5A] to-[#173767] opacity-10"></div>

//       <div className="relative max-w-7xl mx-auto px-6 text-center">
//         <h2 className="text-5xl font-bold text-[#173767] mb-6 animate__animated animate__fadeIn">
//           About Me
//         </h2>
//         <p className="text-xl text-gray-800 mb-8 mx-auto max-w-3xl animate__animated animate__fadeIn animate__delay-1s">
//           I'm a Full Stack Software Engineer passionate about building scalable solutions with a focus on clean design and seamless user experiences. I believe that technology should empower users, and I’m dedicated to creating products that are not only functional but also intuitive and visually pleasing.
//         </p>

//       </div>
//     </section>
//   );
// };

// export default AboutSection;


// src/components/AboutSection.jsx
// import React from 'react';

// const AboutSection = () => {
//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-6 text-center">
//         <h2 className="text-4xl font-bold text-[#173767] mb-8">About Me</h2>
//         <p className="text-lg text-gray-700">
//           I'm a Full Stack Software Engineer passionate about building scalable solutions with a focus on clean design and seamless user experiences.
//         </p>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;
