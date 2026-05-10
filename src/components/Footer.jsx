import React from "react";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#fbfaf9] py-20 flex flex-col items-center justify-center">
      {/* Icons */}
      <div className="flex items-center justify-center gap-8 text-2xl text-[#958c83]">
        <a
          href="#"
          className="transition duration-300 hover:scale-110 hover:text-[#7d746c]"
        >
          <FaInstagram />
        </a>

        <a
          href="#"
          className="transition duration-300 hover:scale-110 hover:text-[#7d746c]"
        >
          <FaTiktok />
        </a>

        <a
          href="#"
          className="transition duration-300 hover:scale-110 hover:text-[#7d746c]"
        >
          <FaWhatsapp />
        </a>
      </div>

     
    </footer>
  );
};

export default Footer;