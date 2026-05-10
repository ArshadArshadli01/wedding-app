import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AMPage from "../assets/AMPage.png";
import musicFile from "../assets/music.mp3";

export default function OpeningScreen({ children }) {
  const [isOpened, setIsOpened] = useState(false);
  const audioRef = useRef(null);

  const handleOpen = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={musicFile} loop />

      <AnimatePresence>
        {!isOpened && (
          <motion.div
            onClick={handleOpen}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-50 cursor-pointer overflow-hidden"
          >
            <img
              src={AMPage}
              alt="Wedding Intro"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.2 }}
                className="
                leading-28px
                  mt-32
                  text-white/80
                  text-4xl
                  italic
                  tracking-wide
                  drop-shadow-md
                  font-bold
                "
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Açmaq üçün toxunun
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div>{children}</div>
    </>
  );
}