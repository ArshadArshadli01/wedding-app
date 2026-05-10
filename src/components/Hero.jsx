import { useEffect, useRef, useState } from "react";
import musicFile from "../assets/music.mp3";

const Hero = () => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Video xətası:", e));
    }
  }, []);

  const handleScroll = () => {
    const nextSection = document.getElementById("next-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return (
    <section className="relative w-screen h-screen overflow-hidden">
      {/* AUDIO ELEMENT */}
      <audio
        ref={audioRef}
        src={musicFile}
        loop
        autoPlay
      />

      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted // Видео обычно должно быть muted для автоплея в браузерах
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source
          src={`${process.env.PUBLIC_URL}/wedding.mp4`}
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* КНОПКА ЗВУКА (ограничена пределами этой секции) */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={toggleMusic}
          className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all active:scale-90 pointer-events-auto"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
        <p className="font-cinzel text-[16px] tracking-[0.45em] uppercase text-white/80 font-light ml-[60px] mb-7">
          WEDDING DAY
        </p>

        <h1 className="font-script text-[72px] sm:text-[90px] md:text-[110px] lg:text-[120px] leading-none text-white">
          Aygün
        </h1>

        <span className="font-cormorant text-2xl md:text-3xl italic font-light text-white/85 my-2">
          &amp;
        </span>

        <h2 className="font-script text-[72px] sm:text-[90px] md:text-[110px] lg:text-[120px] leading-none text-white">
          Vasif
        </h2>
      </div>

      <button
        onClick={handleScroll}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group bg-transparent border-none outline-none hover:opacity-70 hover:scale-105 transition-all duration-300"
      >
        <p className="font-cinzel text-[12px] tracking-[0.4em] uppercase text-white/55 group-hover:text-white/80 transition-colors duration-300">
          AŞAĞI SÜRÜŞDÜRÜN
        </p>
        <svg
          width="16"
          height="10"
          viewBox="0 0 16 10"
          fill="none"
          className="animate-bounce"
        >
          <path
            d="M1 1L8 8L15 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.55"
          />
        </svg>
      </button>
    </section>
  );
};

export default Hero;
