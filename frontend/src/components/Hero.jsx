import React, { useEffect, useRef, useState } from 'react';
import '../Hero.css'; // bird animation styles

const TARGET_VOL = 0.5;         // 0.3 peaceful volume level
const FADE_MS = 2000;           // fade duration in ms
const STEP_MS = 50;             // fade step interval

export default function Hero() {
  const audioRef = useRef(null);
  const fadeTimer = useRef(null);
  const delayTimer = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // start muted

  /** Fade volume to target over time */
  const fadeVolume = (to) => {
    if (!audioRef.current) return;
    clearInterval(fadeTimer.current);

    const audio = audioRef.current;
    const from = audio.volume;
    const steps = Math.ceil(FADE_MS / STEP_MS);
    const delta = (to - from) / steps;
    let currentStep = 0;

    fadeTimer.current = setInterval(() => {
      currentStep += 1;
      audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
      if (currentStep >= steps) clearInterval(fadeTimer.current);
    }, STEP_MS);
  };

  /** Toggle mute with fade in/out */
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.muted || isMuted) {
      audio.muted = false;
      fadeVolume(TARGET_VOL);
      setIsMuted(false);
    } else {
      fadeVolume(0);
      setTimeout(() => {
        audio.muted = true;
        setIsMuted(true);
      }, FADE_MS);
    }
  };

  /** Auto-play after 6s with fade-in */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0;
    audio.muted = true;

    delayTimer.current = setTimeout(() => {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          fadeVolume(TARGET_VOL);
          setIsMuted(false);
        })
        .catch((err) => {
          console.warn('Autoplay blocked:', err);
        });
    }, 6000); // wait 6s before playing

    // Pause on tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      } else if (!audio.paused && !audio.muted) {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(fadeTimer.current);
      clearTimeout(delayTimer.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.pause();
    };
  }, []);

  return (
    <section
      id="hero"
      className="w-full h-screen relative bg-cover bg-center overflow-hidden flex flex-col justify-center items-center text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Ambient River Sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/river.wav" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Sound Toggle Button */}
      <button
        onClick={toggleMute}
        className="absolute top-5 right-5 z-20 bg-[#4d4d54] text-white px-4 py-2 rounded-lg shadow hover:bg-[#575a62] transition"
      >
        {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
      </button>

      {/* Birds Animation */}
      <div className="bird-container bird-container--one">
        <div className="bird bird--one"></div>
      </div>
      <div className="bird-container bird-container--two">
        <div className="bird bird--two"></div>
      </div>
      <div className="bird-container bird-container--three">
        <div className="bird bird--three"></div>
      </div>
      <div className="bird-container bird-container--four">
        <div className="bird bird--four"></div>
      </div>

      {/* Hero Content */}
      <div className="hero-container text-center px-6 z-10">
        <h1 className="text-5xl md:text-6xl font-bold font-megrim text-[#313137] drop-shadow-lg">
          Invest in the Future of Pet Wellness
        </h1>
        <p className="mt-6 text-lg md:text-xl font-poppins text-[#d7e5e9]">
          <span className="typewriter text-3xl md:text-4xl font-bold text-center text-[#173767]">
            Smarter Pet Care. Greener Choices. Real Savings.
          </span>
        </p>

        {/* CTA */}
        <div className="mt-10 flex gap-6 justify-center flex-wrap">
          <a
            href="/contact"
            className="px-6 py-3 bg-[#96b9c6] text-[#080809] font-semibold rounded-lg shadow hover:bg-[#b3bcbf] transition duration-300"
          >
            Contact Us
          </a>
          <a
            href="/investors"
            // hover:bg-[#FFBB33]
            className="px-6 py-3 border-2 border-[#96b9c6] text-black rounded-lg hover:text-[#96b9c6] transition duration-300"
          >
            Invest Now
          </a>
        </div>
      </div>
    </section>
  );
}
