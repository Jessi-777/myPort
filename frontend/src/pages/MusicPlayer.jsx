import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

const tracks = [
  {
    title: "I Said",
    artist: "Tica Rey",
    src: "/assets/music/I_said_Master_Tica_Rey.mp3",
    cover: "/assets/music/cover_tica2.jpg",
  },
  {
    title: "Dale",
    artist: "Tica Rey",
    src: "/assets/music/Dale.mp3",
    cover: "/assets/music/cover_tica2.jpg",
  },
];

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");

  const currentTrack = tracks[trackIndex];

  /* ---------------- AUDIO INIT ---------------- */
  const initAudio = async () => {
    if (audioContextRef.current) return;
    const audio = audioRef.current;
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    audioContextRef.current = context;
  };

  /* ---------------- VISUALIZER ---------------- */
  const animate = () => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;
    const ctx = canvas.getContext("2d");
    analyser.getByteFrequencyData(dataArrayRef.current);

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);
    ctx.clearRect(0, 0, width, height);

    // Multi-layer waves
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        const y =
          height / 2 +
          Math.sin(x * 0.01 + performance.now() * 0.002 + i) *
            (30 + i * 10) *
            ((dataArrayRef.current[x % dataArrayRef.current.length] || 0) / 255 + 0.3);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${94 + i * 20}, ${234 - i * 30}, ${212 + i * 10}, 0.3)`;
      ctx.lineWidth = 2 + i;
      ctx.stroke();
    }

    // Circular spectrum around album
    const centerX = width / 2;
    const centerY = height / 2 - 30;
    const radius = 100 + intensity * 50;
    const bars = 64;
    const step = (2 * Math.PI) / bars;
    for (let i = 0; i < bars; i++) {
      const barHeight = dataArrayRef.current[i] / 2 || 2;
      const angle = i * step;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);
      ctx.strokeStyle = `rgba(150, 185, 198, 0.8)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  /* ---------------- CONTROLS ---------------- */
  const togglePlay = async () => {
    if (!audioContextRef.current) await initAudio();
    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    } else {
      await audioContextRef.current.resume();
      audioRef.current.play();
      animate();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => setTrackIndex((prev) => (prev + 1) % tracks.length);
  const prevTrack = () =>
    setTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));

  /* ---------------- PROGRESS ---------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
      requestAnimationFrame(updateProgress);
    };
    requestAnimationFrame(updateProgress);
  }, [isPlaying]);

  const seekAudio = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audioRef.current.currentTime = audioRef.current.duration * percentage;
    setProgress(percentage * 100);
  };

  /* ---------------- TRACK CHANGE ---------------- */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) audioRef.current.play();
    }
  }, [trackIndex]);

  /* ---------------- DOWNLOAD ---------------- */
  const handleDownload = async () => {
    try {
      await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const link = document.createElement("a");
      link.href = currentTrack.src;
      link.download = `${currentTrack.title}.mp3`;
      link.click();
      setShowEmailModal(false);
      setEmail("");
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-[#96b9c6] to-[#335099] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />

      <div className="relative z-20 flex flex-col items-center backdrop-blur-2xl bg-white/5 rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-lg">
        {/* Album Cover */}
        <div className="relative w-56 h-56 mb-6">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Track Info */}
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center">{currentTrack.title}</h2>
        <p className="text-teal-200 mb-4">{currentTrack.artist}</p>

        {/* Audio Element */}
        <audio ref={audioRef} src={currentTrack.src} />

        {/* Controls */}
        <div className="flex items-center gap-4 my-4">
          <button onClick={prevTrack} className="text-white text-xl p-3 rounded-full hover:bg-white/10 transition">
            <FaBackward />
          </button>
          <button
            onClick={togglePlay}
            className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:scale-105 transition"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={nextTrack} className="text-white text-xl p-3 rounded-full hover:bg-white/10 transition">
            <FaForward />
          </button>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4"
          onClick={seekAudio}
        >
          <div
            className="h-2 bg-gradient-to-r from-[#96b9c6] to-[#335099] rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Download */}
        <button
          onClick={() => setShowEmailModal(true)}
          className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#96b9c6] to-[#335099] text-white hover:opacity-80 transition"
        >
          ⬇ Free Download
        </button>
      </div>

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1f1a] p-8 rounded-2xl w-80 border border-white/10">
            <h3 className="text-white text-xl mb-4">
              Enter email for free download
            </h3>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded-lg bg-white/10 text-white outline-none"
            />
            <button
              onClick={handleDownload}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#96b9c6] to-[#335099] hover:opacity-80 transition"
            >
              Download
            </button>
            <button
              onClick={() => setShowEmailModal(false)}
              className="w-full mt-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


















// import React, { useRef, useState, useEffect } from 'react';


// const tracks = [
//   {
//     title: 'I Said',
//     artist: 'Tica Rey',
//     src: '/assets/music/I_said_Master_Tica_Rey.mp3',
//     cover: '/assets/music/cover_tica2.jpg',
//   },
//   {
//     title: 'Dale',
//     artist: 'Tica Rey',
//     src: '/assets/music/Dale.mp3',
//     cover: '/assets/music/cover_tica2.jpg',
//   },
// ];

// export default function MusicPlayer() {

//   // adding an audio analyzer 
// const analyserRef = useRef(null);
// const dataArrayRef = useRef(null);
// const animationRef = useRef(null);
// const audioContextRef = useRef(null);

//   const audioRef = useRef(null);
//   const [currentTrack, setCurrentTrack] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const playTrack = (index) => {
//     setCurrentTrack(index);
//     setIsPlaying(true);
//     setTimeout(() => audioRef.current.play(), 100);
//   };

//   const togglePlay = () => {
//     if (isPlaying) {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       audioRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   const playPrev = () => {
//     const prev = (currentTrack - 1 + tracks.length) % tracks.length;
//     playTrack(prev);
//   };

// //   const playNext = () => {
// //     const next = (currentTrack + 1) % tracks.length;
// //     playTrack(next);
// //   };

//   const onTimeUpdate = () => {
//     const audio = audioRef.current;
//     if (audio) {
//       setProgress((audio.currentTime / audio.duration) * 100 || 0);
//     }
//   };

//   const onSeek = (e) => {
//     const audio = audioRef.current;
//     const percent = e.target.value;
//     if (audio) {
//       audio.currentTime = (percent / 100) * audio.duration;
//       setProgress(percent);
//     }
//   };

// // Shuffle and repeat state
// const [isShuffle, setIsShuffle] = useState(false);
// const [isRepeat, setIsRepeat] = useState(false);

// // Unified playNext (normal + shuffle)
// const playNext = () => {
//   let next;

//   if (isShuffle) {
//     do {
//       next = Math.floor(Math.random() * tracks.length);
//     } while (next === currentTrack && tracks.length > 1);
//   } else {
//     next = (currentTrack + 1) % tracks.length;
//   }

//   if (next === 0 && !isRepeat) {
//     setIsPlaying(false);
//     audioRef.current.pause();
//     return;
//   }

//   playTrack(next);
// };

// // Audio end handler
// const onEnded = () => {
//   if (isRepeat) {
//     audioRef.current.currentTime = 0;
//     audioRef.current.play();
//   } else {
//     playNext();
//   }
// };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-900 text-white px-4">
//       <div className="bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
//         <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-blue-200 drop-shadow-lg" style={{ textShadow: '0 2px 16px #3b82f6' }}>Music Player</h1>
//         <div className="mb-6 text-center">
//           <span className="text-lg font-semibold text-blue-100 drop-shadow">{tracks[currentTrack].artist}</span>
//           <div className="text-2xl font-bold mt-1 mb-2 text-white drop-shadow">{tracks[currentTrack].title}</div>
//         </div>
//         <div className="w-48 h-48 mb-6 rounded-xl overflow-hidden shadow-2xl border-4 border-blue-300/60 bg-blue-200/20 backdrop-blur">
//           <img
//             src={tracks[currentTrack].cover || '/assets/music/cover_tica1.jpg'}
//             alt="Album Cover"
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <audio
//           ref={audioRef}
//           src={tracks[currentTrack].src}
//           onEnded={onEnded}
//           onTimeUpdate={onTimeUpdate}
//           className="hidden"
//         />
//         {/* Main controls with repeat and shuffle in the middle */}
//         <div className="flex justify-center items-center w-full mb-4 mt-2 space-x-4">
//           <button
//             onClick={() => setIsRepeat(!isRepeat)}
//             className={`p-2 rounded-full transition relative ${isRepeat ? 'bg-gradient-to-br  text-gray-400 ring-2 ring-gray-700' : 'bg-black text-white'} shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-grey-800 hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-900`} aria-label="Repeat"
//           >
//             {/* Modern repeat icon */}
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
//               <polyline points="17 1 21 5 17 9" />
//               <path d="M3 11V9a4 4 0 0 1 4-4h14" />
//               <polyline points="7 23 3 19 7 15" />
//               <path d="M21 13v2a4 4 0 0 1-4 4H3" />
//             </svg>
//             {isRepeat && (
//               <span className="absolute top-0 right-0 text-xs font-bold bg-blue-400 text-white rounded-full px-1.5 py-0.5" style={{transform: 'translate(40%,-40%)'}}>1</span>
//             )}
//           </button>
//           <button
//             onClick={playPrev}
//             className="p-2 rounded-full bg-black text-cyan-300 shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-cyan-400 hover:bg-gradient-to-br hover:from-cyan-800 hover:to-blue-800 transition"
//             aria-label="Previous"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//             </svg>
//           </button>
//           <button
//             onClick={togglePlay}
//             className="p-4 rounded-full bg-black text-lime-300 shadow-xl hover:scale-110 active:scale-95 focus:ring-2 focus:ring-lime-400 hover:bg-gradient-to-br hover:from-lime-700 hover:to-emerald-700 transition"
//             aria-label={isPlaying ? 'Pause' : 'Play'}
//           >
//             {isPlaying ? (
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75v10.5m10.5-10.5v10.5" />
//               </svg>
//             ) : (
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25l13.5 6.75-13.5 6.75V5.25z" />
//               </svg>
//             )}
//           </button>
//           <button
//             onClick={playNext}
//             className="p-2 rounded-full bg-black text-orange-300 shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-orange-400 hover:bg-gradient-to-br hover:from-orange-700 hover:to-amber-700 transition"
//             aria-label="Next"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//             </svg>
//           </button>
//           <button
//             onClick={() => setIsShuffle(!isShuffle)}
//             className={`p-2 rounded-full transition ${isShuffle ? 'bg-gradient-to-br from-cyan-700 via-sky-700 to-indigo-700 text-white ring-2 ring-cyan-400' : 'bg-black text-cyan-300'} shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-cyan-400 hover:bg-gradient-to-br hover:from-cyan-800 hover:to-indigo-800`} aria-label="Shuffle"
//           >
//             {/* Modern shuffle icon */}
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
//               <polyline points="16 3 21 3 21 8" />
//               <line x1="4" y1="20" x2="21" y2="3" />
//               <polyline points="21 16 21 21 16 21" />
//               <line x1="15" y1="15" x2="21" y2="21" />
//             </svg>
//           </button>
//         </div>
//         <input
//           type="range"
//           min="0"
//           max="100"
//           value={progress}
//           onChange={onSeek}
//           className="w-full accent-blue-400 h-2 rounded-lg appearance-none bg-blue-200/40  mb-4 shadow-inner"
//         />
//         <div className="w-full mt-2">
//           <ul className="divide-y divide-blue-200/10 rounded-3xl overflow-hidden shadow-2xl border border-blue-300/30 bg-white/10 backdrop-blur-lg" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 8px 0 rgba(80, 120, 255, 0.12)'}}>
//             {tracks.map((track, idx) => (
//               <li
//                 key={track.title}
//                 className={`flex items-center px-4 py-3 cursor-pointer group transition-all duration-200 relative ${idx === currentTrack ? ' text-white font-bold ring-2 ring-blue-400/60 shadow-lg' : 'hover:bg-gradient-to-r hover:from-blue-700/60 hover:to-blue-500/40 hover:text-white text-blue-100'}`}
//                 style={idx === currentTrack ? {backdropFilter: 'blur(8px)'} : {}}
//                 onClick={() => playTrack(idx)}
//               >
//                 <img
//                   src={track.cover || '/assets/music/default-cover.jpg'}
//                   alt="cover"
//                   className={`w-12 h-12 rounded-xl object-cover mr-4 border-2 ${idx === currentTrack ? 'border-blue-300 shadow-blue-400/40 shadow-md animate-pulse' : 'border-blue-700/40 group-hover:border-blue-400/80'}`}
//                 />
//                 <div className="flex flex-col">
//                   <div className="text-base tracking-wide font-semibold drop-shadow-sm">{track.title}</div>
//                   <div className="text-xs text-blue-200/80 group-hover:text-blue-100 font-light">{track.artist}</div>
//                 </div>
//                 {idx === currentTrack && (
//                   <span className="ml-auto text-blue-100 bg-blue-900/60 px-3 py-1 rounded-full text-xs font-bold shadow-md animate-fade-in">Now Playing</span>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
