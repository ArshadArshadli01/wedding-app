import { useEffect, useState } from "react";

const WEDDING_TIMESTAMP = Date.UTC(2026, 5, 5, 20, 0, 0);

function getTimeLeft() {
  const diff = WEDDING_TIMESTAMP - Date.now();
  if (diff <= 0) return { days: "00", hours: "00", minutes: "00", seconds: "00" };

  const pad = (n) => String(Math.floor(n)).padStart(2, "0");
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days:    pad(totalSeconds / 86400),
    hours:   pad((totalSeconds % 86400) / 3600),
    minutes: pad((totalSeconds % 3600) / 60),
    seconds: pad(totalSeconds % 60),
  };
}

const useCountdown = () => {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
};

const Separator = () => (
  <div
    className="text-[#c9a96e] text-3xl font-light mt-2 hidden sm:block"
    style={{ fontFamily: "'Cormorant Garamond', serif" }}
  >
    ·
  </div>
);

const CountdownItem = ({ value, label }) => (
  <div className="flex flex-col items-center gap-1 w-[42%] sm:w-auto">
    <span
      className="text-4xl sm:text-5xl md:text-6xl font-light text-[#2c2418] tracking-wider tabular-nums"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {value}
    </span>
    <span
      className="text-[9px] tracking-[0.35em] uppercase text-[#b8a898] font-light"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {label}
    </span>
  </div>
);

const InvitationSection = () => {
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <section
      id="next-section"
      className="w-full min-h-screen flex flex-col items-center justify-center  py-6 md:py-24 px-3 md:px-6"
      style={{ backgroundColor: "#FBFAF9" }}
    >
      <div className="w-px h-16 mb-14" style={{ backgroundColor: "#c9a96e" }} />

      <p
        className="text-center text-[#3d3028] max-w-xl leading-relaxed mb-4"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(18px, 2.8vw, 24px)",
          fontStyle: "italic",
          fontWeight: 300,
        }}
      >
        Sevgi ilə yazılan hekayəmizin ən gözəl səhifəsinə
        <br />
        sizi də dəvət edirik
      </p>

      <p
        className="text-center text-[#a09080] max-w-md leading-relaxed mb-10"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(13px, 1.8vw, 16px)",
          fontWeight: 300,
        }}
      >
        We invite you to the most beautiful page of our story written with love
      </p>

      <p
        className="mb-5  leading-none"
        style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: "clamp(60px, 10vw, 96px)",
          color: "#c9a96e",
        }}
      >
        6 İyun
      </p>
<p
        className="tracking-[0.35em] uppercase text-[#a09080] mb-16 text-center"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(9px, 1.2vw, 11px)",
          fontWeight: 300,
        }}
      >
        Böyük məmnuniyyət hissi ilə sizi, toy günümüzün sevincini bizimlə bölüşməyə dəvət edirik
      </p>

      <div className="flex flex-wrap justify-center items-start gap-y-8 gap-x-6 sm:flex-nowrap sm:gap-x-10 md:gap-x-16 mb-16 max-w-[320px] sm:max-w-none">
        <CountdownItem value={days}    label="Gün"    />
        <Separator />
        <CountdownItem value={hours}   label="Saat"   />
        <Separator />
        <CountdownItem value={minutes} label="Dəqiqə" />
        <Separator />
        <CountdownItem value={seconds} label="Saniyə" />
      </div>

      <div className="w-px h-16" style={{ backgroundColor: "#c9a96e" }} />
    </section>
  );
};

export default InvitationSection;
