// import React, { useRef, useState, useEffect } from "react";
// import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

// const tracks = [
//   {
//     title: "I Said",
//     artist: "T!CA REY",
//     src: "/assets/music/I_said_Master_Tica_Rey.mp3",
//     cover: "/assets/music/cover_tica2.jpg",
//   },
//   {
//     title: "Dale",
//     artist: "T!CA REY",
//     src: "/assets/music/Dale.mp3",
//     cover: "/assets/music/cover_tica2.jpg",
//   },
// ];

// export default function MusicPlayer() {
//   const audioRef = useRef(null);
//   const canvasRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const dataArrayRef = useRef(null);
//   const animationRef = useRef(null);

//   const [trackIndex, setTrackIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [intensity, setIntensity] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [email, setEmail] = useState("");

//   const currentTrack = tracks[trackIndex];

//   /* ---------------- AUDIO INIT ---------------- */
//   const initAudio = async () => {
//     if (audioContextRef.current) return;
//     const audio = audioRef.current;
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     const analyser = context.createAnalyser();
//     analyser.fftSize = 512;
//     const source = context.createMediaElementSource(audio);
//     source.connect(analyser);
//     analyser.connect(context.destination);
//     analyserRef.current = analyser;
//     dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
//     audioContextRef.current = context;
//   };

//   /* ---------------- VISUALIZER ---------------- */
//   const animate = () => {
//     const analyser = analyserRef.current;
//     const canvas = canvasRef.current;
//     if (!analyser || !canvas) return;
//     const ctx = canvas.getContext("2d");
//     analyser.getByteFrequencyData(dataArrayRef.current);

//     const width = (canvas.width = canvas.offsetWidth);
//     const height = (canvas.height = canvas.offsetHeight);
//     ctx.clearRect(0, 0, width, height);

//     // Multi-layer waves
//     for (let i = 0; i < 3; i++) {
//       ctx.beginPath();
//       for (let x = 0; x < width; x += 2) {
//         const y =
//           height / 2 +
//           Math.sin(x * 0.01 + performance.now() * 0.002 + i) *
//             (30 + i * 10) *
//             ((dataArrayRef.current[x % dataArrayRef.current.length] || 0) / 255 + 0.3);
//         ctx.lineTo(x, y);
//       }
//       ctx.strokeStyle = `rgba(${94 + i * 20}, ${234 - i * 30}, ${212 + i * 10}, 0.3)`;
//       ctx.lineWidth = 2 + i;
//       ctx.stroke();
//     }

//     // Circular spectrum around album
//     const centerX = width / 2;
//     const centerY = height / 2 - 30;
//     const radius = 100 + intensity * 50;
//     const bars = 64;
//     const step = (2 * Math.PI) / bars;
//     for (let i = 0; i < bars; i++) {
//       const barHeight = dataArrayRef.current[i] / 2 || 2;
//       const angle = i * step;
//       const x1 = centerX + Math.cos(angle) * radius;
//       const y1 = centerY + Math.sin(angle) * radius;
//       const x2 = centerX + Math.cos(angle) * (radius + barHeight);
//       const y2 = centerY + Math.sin(angle) * (radius + barHeight);
//       ctx.strokeStyle = `rgba(150, 185, 198, 0.8)`;
//       ctx.lineWidth = 3;
//       ctx.beginPath();
//       ctx.moveTo(x1, y1);
//       ctx.lineTo(x2, y2);
//       ctx.stroke();
//     }

//     animationRef.current = requestAnimationFrame(animate);
//   };

//   /* ---------------- CONTROLS ---------------- */
//   const togglePlay = async () => {
//     if (!audioContextRef.current) await initAudio();
//     if (isPlaying) {
//       audioRef.current.pause();
//       cancelAnimationFrame(animationRef.current);
//       setIsPlaying(false);
//     } else {
//       await audioContextRef.current.resume();
//       audioRef.current.play();
//       animate();
//       setIsPlaying(true);
//     }
//   };

//   const nextTrack = () => setTrackIndex((prev) => (prev + 1) % tracks.length);
//   const prevTrack = () =>
//     setTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));

//   /* ---------------- PROGRESS ---------------- */
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const updateProgress = () => {
//       setProgress((audio.currentTime / audio.duration) * 100 || 0);
//       requestAnimationFrame(updateProgress);
//     };
//     requestAnimationFrame(updateProgress);
//   }, [isPlaying]);

//   const seekAudio = (e) => {
//     const rect = e.target.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;
//     const percentage = clickX / rect.width;
//     audioRef.current.currentTime = audioRef.current.duration * percentage;
//     setProgress(percentage * 100);
//   };

//   /* ---------------- TRACK CHANGE ---------------- */
//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.load();
//       if (isPlaying) audioRef.current.play();
//     }
//   }, [trackIndex]);

//   /* ---------------- DOWNLOAD ---------------- */
//   const handleDownload = async () => {
//     try {
//       await fetch("/api/email-capture", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const link = document.createElement("a");
//       link.href = currentTrack.src;
//       link.download = `${currentTrack.title}.mp3`;
//       link.click();
//       setShowEmailModal(false);
//       setEmail("");
//     } catch (err) {
//       console.error("Download error:", err);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-[#96b9c6] to-[#335099] overflow-hidden">
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full h-full opacity-60"
//       />

//       <div className="relative z-20 flex flex-col items-center backdrop-blur-2xl bg-white/5 rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-lg">
//         {/* Album Cover */}
//         <div className="relative w-56 h-56 mb-6">
//           <img
//             src={currentTrack.cover}
//             alt={currentTrack.title}
//             className="w-full h-full object-cover rounded-2xl shadow-lg"
//           />
//         </div>

//         {/* Track Info */}
//         <h2 className="text-2xl md:text-3xl font-bold text-white text-center">{currentTrack.title}</h2>
//         <p className="text-[#222528] mb-4">{currentTrack.artist}</p>

//         {/* Audio Element */}
//         <audio ref={audioRef} src={currentTrack.src} />

//         {/* Controls */}
//         <div className="flex items-center gap-4 my-4">
//           <button onClick={prevTrack} className="text-white text-xl p-3 rounded-full hover:bg-white/10 transition">
//             <FaBackward />
//           </button>
//           <button
//             onClick={togglePlay}
//             className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:scale-105 transition"
//           >
//             {isPlaying ? <FaPause /> : <FaPlay />}
//           </button>
//           <button onClick={nextTrack} className="text-white text-xl p-3 rounded-full hover:bg-white/10 transition">
//             <FaForward />
//           </button>
//         </div>

//         {/* Progress Bar */}
//         <div
//           className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4"
//           onClick={seekAudio}
//         >
//           <div
//             className="h-2 bg-gradient-to-r from-[#96b9c6] to-[#335099] rounded-full"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>

//         {/* Download */}
//         <button
//           onClick={() => setShowEmailModal(true)}
//           className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#96b9c6] to-[#335099] text-white hover:opacity-80 transition"
//         >
//           ⬇ Free Download
//         </button>
//       </div>

//       {/* EMAIL MODAL */}
//       {showEmailModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="bg-[#0f1f1a] p-8 rounded-2xl w-80 border border-white/10">
//             <h3 className="text-white text-xl mb-4">
//               Enter email for free download
//             </h3>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full mb-4 px-4 py-2 rounded-lg bg-white/10 text-white outline-none"
//             />
//             <button
//               onClick={handleDownload}
//               className="w-full py-2 rounded-lg bg-gradient-to-r from-[#96b9c6] to-[#335099] hover:opacity-80 transition"
//             >
//               Download
//             </button>
//             <button
//               onClick={() => setShowEmailModal(false)}
//               className="w-full mt-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }















