"use client";

import { useState } from "react";

const DressIcon = () => (
  <svg
    width="36"
    height="44"
    viewBox="0 0 36 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 2C18 2 12 8 6 10L2 42H34L30 10C24 8 18 2 18 2Z"
      stroke="#c9a96e"
      strokeWidth="1.2"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 10C12 10 15 16 18 16C21 16 24 10 24 10"
      stroke="#c9a96e"
      strokeWidth="1.2"
      fill="none"
    />
  </svg>
);

const SuitIcon = () => (
  <svg
    width="36"
    height="44"
    viewBox="0 0 36 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 4L12 14L18 10L24 14L30 4"
      stroke="#c9a96e"
      strokeWidth="1.2"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M6 4L2 42H34L30 4"
      stroke="#c9a96e"
      strokeWidth="1.2"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M18 10V28M15 16L18 20L21 16"
      stroke="#c9a96e"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ContactSection = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSent(true);
    setName("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section
      className="w-full flex flex-col items-center py-6 md:py-24 px-3 md:px-6"
      style={{ backgroundColor: "#FBFAF9" }}
    >
      {/* ── DRESS CODE ── */}
      <p
        className="uppercase tracking-[0.4em] text-[#b8a898] mb-3 font-light"
        style={{ fontFamily: "'Cinzel', serif", fontSize: "12px" }}
      >
        Dress Code
      </p>

      <h2
        className="text-[#2c2418] mb-6 leading-none"
        style={{
          fontFamily: "'Pinyon Script', cursive",
          fontSize: "clamp(42px, 7vw, 68px)",
        }}
      >
        Elegant Classic
      </h2>

      {/* ICONS */}
      <div className="flex items-end gap-8 mb-10">
        <DressIcon />
        <SuitIcon />
      </div>

      {/* LOCATION BUTTON */}
      <a
        href="https://www.google.com/maps/place/%22Ay+%C4%B0%C5%9F%C4%B1%C4%9F%C4%B1%22+%C5%9Fadl%C4%B1q+saray%C4%B1/@40.405447,49.928517,434m/data=!3m1!1e3!4m6!3m5!1s0x403062e3be667bc3:0xc5d96a1201a7bc79!8m2!3d40.4054248!4d49.9302005!16s%2Fg%2F1tx8rpcm?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col gap-2 text-center justify-center items-center px-8 py-3 mb-12 md:mb-24 transition-all duration-300"
        style={{
          border: "1px solid #c9a96e",
          color: "#c9a96e",
          fontFamily: "'Cinzel', serif",
          fontSize: "10px",
          letterSpacing: "0.3em",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#c9a96e";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#c9a96e";
        }}
      >
        <div className="flex items-center gap-2">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
            <path
              d="M6 1C3.79 1 2 2.79 2 5C2 8 6 13 6 13C6 13 10 8 10 5C10 2.79 8.21 1 6 1ZM6 6.5C5.17 6.5 4.5 5.83 4.5 5C4.5 4.17 5.17 3.5 6 3.5C6.83 3.5 7.5 4.17 7.5 5C7.5 5.83 6.83 6.5 6 6.5Z"
              fill="currentColor"
            />
          </svg>
          Məkana Keçid
        </div>

        <div>Ay İşığı (Sektor - A)</div>
      </a>

      {/* ── MESSAGE FORM ── */}
      <h2
        className="text-[#2c2418] mb-10 text-center"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 300,
        }}
      >
        Ürək sözləriniz
      </h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col gap-4"
      >
        {/* NAME */}
        <input
          type="text"
          placeholder="Adınız"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-transparent text-[#3d3028] placeholder-[#c0b0a0] outline-none transition-all duration-200"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "15px",
            border: "1px solid #ddd0c0",
            borderRadius: "2px",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd0c0")}
        />

        {/* MESSAGE */}
        <textarea
          placeholder="Mesajınız"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 bg-transparent text-[#3d3028] placeholder-[#c0b0a0] outline-none resize-none transition-all duration-200"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "15px",
            border: "1px solid #ddd0c0",
            borderRadius: "2px",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd0c0")}
        />

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full py-3 transition-all duration-300 mt-1"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "10px",
            letterSpacing: "0.35em",
            border: "1px solid #c9a96e",
            color: "#c9a96e",
            backgroundColor: "transparent",
            borderRadius: "2px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#c9a96e";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#c9a96e";
          }}
        >
          {sent ? "✓ GÖNDƏRILDI" : "GÖNDƏR"}
        </button>
      </form>
    </section>
  );
};

export default ContactSection;
