import React, { useEffect, useRef, useState } from 'react';
import '../Hero.css';

const TARGET_VOL = 0.5;
const FADE_MS    = 2000;
const STEP_MS    = 50;

export default function Hero() {
  const audioRef        = useRef(null);
  const fadeIntervalRef = useRef(null);
  const delayTimer      = useRef(null);
  const userToggledRef  = useRef(false);
  const [isMuted, setIsMuted] = useState(true);

  // ── Fade volume from current → `to`, then call onComplete ──
  const fadeVolume = (to, onComplete) => {
    const audio = audioRef.current;
    if (!audio) return;

    clearInterval(fadeIntervalRef.current);

    const steps = Math.ceil(FADE_MS / STEP_MS);
    const delta = (to - audio.volume) / steps;
    let step = 0;

    fadeIntervalRef.current = setInterval(() => {
      step++;
      audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
      if (step >= steps) {
        clearInterval(fadeIntervalRef.current);
        audio.volume = to; // snap to avoid float drift
        onComplete?.();
      }
    }, STEP_MS);
  };

  // ── Button handler ──
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    userToggledRef.current = true;

    if (isMuted) {
      // Turn sound ON
      audio.muted = false;

      if (audio.paused) {
        audio.play().catch(() => {});
      }
      fadeVolume(TARGET_VOL);
      setIsMuted(false);
    } else {
      // Turn sound OFF — fade out then pause
      fadeVolume(0, () => {
        audio.pause();
        audio.currentTime = 0;
        setIsMuted(true);
      });
    }
  };

  // ── On mount: start audio muted immediately, then fade in after 3s ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop   = true;
    audio.volume = 0;

    // Play muted immediately so it's ready (browsers allow muted autoplay)
    audio.muted = true;
    audio.play().catch(() => {});

    // After 3s unmute and fade in
    delayTimer.current = setTimeout(() => {
      if (userToggledRef.current) return;

      audio.muted = false;
      fadeVolume(TARGET_VOL, () => {
        if (userToggledRef.current) return;
        setIsMuted(false);
      });
    }, 3000);

    // Pause when user switches tabs, resume when they come back
    const handleVisibility = () => {
      if (document.hidden) {
        audio.pause();
      } else if (audio.paused && !audio.muted) {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(fadeIntervalRef.current);
      clearTimeout(delayTimer.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      audio.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      id="hero"
      className="w-full h-screen relative bg-cover bg-center overflow-hidden flex flex-col justify-center items-center text-white"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/ninjagrvl/image/upload/v1770699492/jh4qmpefsevkiftotewa.jpg')",
      }}
    >
      {/* Ambient River Sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/music/river.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {/* Sound Toggle Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-5 z-20 bg-[#4d4d54be] text-white px-4 py-2 rounded-lg shadow hover:bg-[#575a62] transition"
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
      <div className="hero-container bottom-28 text-center px-6 z-10">
        <h1 className="text-5xl md:text-6xl font-bold font-megrim text-[#313137] drop-shadow-lg">
          "I create what I believe in.
           Some of it becomes companies."
        </h1>
        <p className="mt-6 text-lg md:text-xl font-poppins text-[#d7e5e9]">
          <span className="typewriter text-3xl md:text-4xl font-bold text-center text-[#173767]">
            Software Engineer, Development and Designer of Digital Ventures.
          </span>
        </p>
      </div>
    </section>
  );
}




// import React, { useEffect, useRef, useState } from 'react';
// import '../Hero.css'; // bird animation styles

// const TARGET_VOL = 0.5;         // 0.3 peaceful volume level
// const FADE_MS = 2000;           // fade duration in ms
// const STEP_MS = 50;             // fade step interval

// export default function Hero() {
//   const audioRef = useRef(null);
//   const fadeTimer = useRef(null);
//   const delayTimer = useRef(null);
//   const [isMuted, setIsMuted] = useState(true); // start muted

//   /** Fade volume to target over time */
//   const fadeVolume = (to) => {
//     if (!audioRef.current) return;
//     clearInterval(fadeTimer.current);

//     const audio = audioRef.current;
//     const from = audio.volume;
//     const steps = Math.ceil(FADE_MS / STEP_MS);
//     const delta = (to - from) / steps;
//     let currentStep = 0;

//     fadeTimer.current = setInterval(() => {
//       currentStep += 1;
//       audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
//       if (currentStep >= steps) clearInterval(fadeTimer.current);
//     }, STEP_MS);
//   };

//   /** Toggle mute with fade in/out */
//   const toggleMute = () => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (audio.muted || isMuted) {
//       audio.muted = false;
//       fadeVolume(TARGET_VOL);
//       setIsMuted(false);
//     } else {
//   fadeVolume(0);

//   fadeTimer.current = setTimeout(() => {
//     audio.pause(); // actually stop playback
//     audio.currentTime = 0; // optional reset to beginning
//     audio.muted = true;
//     setIsMuted(true);
//   }, FADE_MS);
// }
//   };


//   /** Auto-play after 6s with fade-in */
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     audio.loop = true;
//     audio.volume = 0;
//     audio.muted = true;

//     delayTimer.current = setTimeout(() => {
//       audio.muted = false;
//       audio
//         .play()
//         .then(() => {
//           fadeVolume(TARGET_VOL);
//           setIsMuted(false);
//         })
//         .catch((err) => {
//           console.warn('Autoplay blocked:', err);
//         });
//     }, 6000); // wait 6s before playing

//     // Pause on tab switch
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         audio.pause();
//       } else if (audio.paused && !audio.muted) {
//         audio.play().catch(() => {});
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       clearInterval(fadeTimer.current);
//       clearTimeout(delayTimer.current);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       audio.pause();
//     };
//   }, []);

//   return (
//     <section
//       id="hero"
//       className="w-full h-screen relative bg-cover bg-center overflow-hidden flex flex-col justify-center items-center text-white"
//       // Original background image:
//       // style={{
//       //   backgroundImage:
//       //     "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')",
//       // }}
//       // Suggested alternative: Calming forest with mist and soft light
//       style={{
//         backgroundImage:
//           // "url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1950&q=80')",
//           "url('https://res.cloudinary.com/ninjagrvl/image/upload/v1770699492/jh4qmpefsevkiftotewa.jpg')"
//           // "url('https://res.cloudinary.com/ninjagrvl/image/upload/v1772263768/a1pbrvr6kfqzqgsovfdb.jpg')",
//       }}
//     >
//       {/* "audio/mpeg"  */}
//       {/* Ambient River Sound */}
//       <audio ref={audioRef} preload="auto">
//         <source src="/music/river.wav" type="audio/wav" />
//          {/* <source src="/music/river.wav" type="audio/mpeg" /> */}
//         Your browser does not support the audio element.
//       </audio>

//       {/* Sound Toggle Button */}
//       <button
//         onClick={toggleMute}
//         className="absolute bottom-8 right-5 z-20 bg-[#4d4d54be] text-white px-4 py-2 rounded-lg shadow hover:bg-[#575a62] transition"
//       >
//         {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
//       </button>

//       {/* Birds Animation */}
//       <div className="bird-container bird-container--one">
//         <div className="bird bird--one"></div>
//       </div>
//       <div className="bird-container bird-container--two">
//         <div className="bird bird--two"></div>
//       </div>
//       <div className="bird-container bird-container--three">
//         <div className="bird bird--three"></div>
//       </div>
//       <div className="bird-container bird-container--four">
//         <div className="bird bird--four"></div>
//       </div>

//       {/* Hero Content */}
//       <div className="hero-container bottom-28 text-center px-6 z-10">
//         <h1 className="text-5xl md:text-6xl font-bold font-megrim text-[#313137] drop-shadow-lg">
//           “I create what I believe in.
//            Some of it becomes companies.”
//         </h1>
//         <p className="mt-6 text-lg md:text-xl font-poppins text-[#d7e5e9]">
//           <span className="typewriter text-3xl md:text-4xl font-bold text-center text-[#173767]">
//             Software Engineer, Development and Designer of Digital Ventures. 
//           </span>
//         </p>

//         {/* CTA */}
//         {/* <div className="mt-10 flex gap-6 justify-center flex-wrap">
//           <a
//             href="/contact"
//             className="px-6 py-3 bg-[#96b9c6] text-[#080809] font-semibold rounded-lg shadow hover:bg-[#b3bcbf] transition duration-300"
//           >
//             Contact Us
//           </a>
//           <a
//             href="/investors"
//             // hover:bg-[#FFBB33]
//             className="px-6 py-3 border-2 border-[#96b9c6] text-black rounded-lg hover:text-[#96b9c6] transition duration-300"
//           >
//             Invest Now
//           </a>
//         </div> */}
//       </div>
//     </section>
//   );
// }
