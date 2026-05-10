import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../apiBase";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const MessagesSection = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/messages"));
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setError("Təbrikləri yükləmək mümkün olmadı.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }
      setMessages((prev) => [data, ...prev]);
      setName("");
      setMessage("");
    } catch {
      setError("Təbrik göndərilə bilmədi. Yenidən cəhd edin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FBFAF9] py-6 md:py-24 px-3 md:px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h2
          className="text-[#2c2418] mb-10 "
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 300,
          }}
        >
          Təbriklər
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mb-12 text-left max-w-[512px] mx-auto space-y-4"
        >
          <div>
            <label
              htmlFor="congrats-name"
              className="block text-sm text-[#5c554d] mb-1"
            >
              Adınız
            </label>
            <input
              id="congrats-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[#2a2622] shadow-sm focus:border-[#958c83] focus:outline-none focus:ring-1 focus:ring-[#958c83]"
              placeholder="Adınızı yazın"
              disabled={submitting}
            />
          </div>
          <div>
            <label
              htmlFor="congrats-message"
              className="block text-sm text-[#5c554d] mb-1"
            >
              Təbrik mesajınız
            </label>
            <textarea
              id="congrats-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={4000}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[#2a2622] shadow-sm focus:border-[#958c83] focus:outline-none focus:ring-1 focus:ring-[#958c83] resize-y min-h-[100px]"
              placeholder="Təbrikinizi buraya yazın"
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="inline-flex items-center justify-center rounded-md bg-[#2c2418] px-5 py-2.5 text-sm font-medium text-[#faf7f4] shadow-sm transition hover:bg-[#3d3428] disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? "Göndərilir…" : "Təbrik göndər"}
          </button>
        </form>

        {error && (
          <p className="text-red-700 text-sm mb-6 max-w-[512px] mx-auto">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-[#958c83] italic">Yüklənir…</p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 text-left w-full flex flex-col items-center"
          >
            {messages.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-[#faf7f4] w-full max-w-[512px] border border-gray-200 rounded-md p-4 sm:p-6 md:p-8 shadow-sm"
              >
                <h3 className="text-lg md:text-xl font-semibold text-[#2a2622]">
                  {item.name}
                </h3>
                <p className="mt-3 text-[#958c83] italic leading-relaxed">
                  &ldquo;{item.message}&rdquo;
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MessagesSection;
