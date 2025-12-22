import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import Projects from './Projects';
import Shop from './Shop';
// import InvestorInfo from '../components/InvestorInfo'; 

const Home = () => {
  return (
    <div>
      <Hero />
      <AboutSection />
      <Projects />
      {/* <InvestorInfo />z */}
      <Shop />
    </div>
  );
};

export default Home;



