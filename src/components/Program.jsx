import { useEffect, useRef, useState } from "react";

const events = [
  { time: "18:00", label: "Qonaqların qarşılanması" },
  { time: "19:00", label: "Bəy və gəlinin girişi" },
  { time: "19:30", label: "Təbrik və tort kəsilməsi" },
  { time: "20:00", label: "Bəy və gəlinin ilk rəqsi" },
  { time: "20:30", label: "Toy ziyafəti" },
  { time: "22:00", label: "Əyləncə" },
  { time: "00:00", label: "Gecənin sonu" },
];

const useVisible = (threshold = 0.2) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

const TimelineItem = ({ time, label, index }) => {
  const [ref, visible] = useVisible(0.2);

  return (
    <div
      ref={ref}
      className="flex items-center gap-0 w-full max-w-lg mx-auto"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
      }}
    >
      {/* TIME */}
      <div className="w-16 sm:w-20 text-right flex-shrink-0">
        <span
          className="text-[#c9a96e] text-sm sm:text-base font-light"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {time}
        </span>
      </div>

      {/* DOT + LINE */}
      <div className="flex flex-col items-center mx-4 sm:mx-6 self-stretch">
        <div
          className="w-px flex-1"
          style={{ backgroundColor: index === 0 ? "transparent" : "#e0d0bc" }}
        />
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 my-1"
          style={{ backgroundColor: "#c9a96e" }}
        />
        <div
          className="w-px flex-1"
          style={{ backgroundColor: index === events.length - 1 ? "transparent" : "#e0d0bc" }}
        />
      </div>

      {/* LABEL */}
      <div className="flex-1 py-6">
        <p
          className="text-[#3d3028] text-sm sm:text-base font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(15px, 2vw, 18px)" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

const Program = () => {
  const [titleRef, titleVisible] = useVisible(0.3);

  return (
    <section
      className="w-full py-1 px-6 flex flex-col items-center"
      style={{ backgroundColor: "#FBFAF9" }}
    >
      {/* TITLE */}
      <h2
        ref={titleRef}
        className="mb-16 text-[#2c2418]"
        style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: "clamp(52px, 8vw, 80px)",
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        Program
      </h2>

      {/* TIMELINE */}
      <div className="w-full flex flex-col">
        {events.map((event, i) => (
          <TimelineItem
            key={i}
            index={i}
            time={event.time}
            label={event.label}
          />
        ))}
      </div>
    </section>
  );
};

export default Program;
