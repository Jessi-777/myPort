// components/TypingHeader.jsx
import React from 'react';
import { TypeAnimation } from 'react-type-animation';

const TypingHeader = () => {
  return (
    <h1 className="text-3xl md:text-4xl font-bold text-center text-[#173767]">
      <TypeAnimation
        sequence={[
          'Smarter Pet Care.', 2000,
          'Greener Choices.', 2000,
          'Real Savings.', 2000,
        ]}
        speed={50}
        repeat={Infinity}
        wrapper="span"
      />
    </h1>
  );
};

export default TypingHeader;


// import React from 'react';
// import { TypeAnimation } from 'react-type-animation';

// const TypingHeader = () => {
//   return (
//     <h1 className="text-3xl md:text-4xl font-bold text-center text-[#173767]">
//       <TypeAnimation
//         sequence={[
//           'Smarter Pet Care.', 2000,
//           'Greener Choices.', 2000,
//           'Real Savings.', 2000,
//         ]}
//         wrapper="span"
//         speed={50}
//         repeat={Infinity}
//       />
//     </h1>
//   );
// };

// export default TypingHeader;
