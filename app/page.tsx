"use client";
import React, { useState, useEffect } from "react";
import { Instagram, Globe, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { FlipWords } from "@/components/ui/flip-words";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target: Dec 31, 2025
    const targetDate = new Date("2025-12-31T00:00:00");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const flipWords = ["รวดเร็ว", "ชัดเจน"];
  
  const placeholders = [
    "ฝ่ายโสตมีสมาชิกกี่คน?",
    "มีกี่อัลบั้มในเว็ปไซต์ SodBD2?",
    "เกี่ยวกับฝ่ายโสตบดินทร 2",
    "ประวัติของ SodBD2 JPEG",
    "ประธานโสตหล่อไหม",

  ];

  const handleChange = () => {
    // Handle input change
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submit
  };

  return (
    <div className="min-h-screen w-full bg-black relative flex flex-col antialiased font-[family-name:var(--font-kanit)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-white">SodChatbot</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://sodbd2.pics/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-black text-xs sm:text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">เว็บไซต์หลัก</span>
            </a>
            <a
              href="https://www.instagram.com/sodbd2_jpeg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black border border-white/20 text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">ติดตามเรา</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Background Effects */}
      <BackgroundBeams className="absolute inset-0" />
      
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-neutral-400 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white" />
            เปิดตัว 31 ธันวาคม 2568
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-3 sm:mb-4">
            SodChatbot
          </h1>
          <div className="text-lg sm:text-xl md:text-3xl text-neutral-400 font-light">
            อนาคตของ Chatbot ที่
            <FlipWords words={flipWords} className="text-white font-medium" />
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 sm:mt-8 text-neutral-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2"
        >
          สัมผัสประสบการณ์แชทบอทจากฝ่ายโสตบดินทร 2 ที่ฉลาด และรวดเร็วทันใจ
        </motion.p>

        {/* Sample Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 w-full max-w-xl"
        >
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
          <p className="text-neutral-600 text-xs mt-3">
            ตัวอย่างคำถามที่สามารถถาม SodChatbot ได้
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 sm:mt-12 flex justify-center gap-1.5 sm:gap-3 md:gap-6"
        >
          {[
            { value: timeLeft.days, label: "วัน" },
            { value: timeLeft.hours, label: "ชม." },
            { value: timeLeft.minutes, label: "นาที" },
            { value: timeLeft.seconds, label: "วิ" },
          ].map((item, index) => (
            <React.Fragment key={item.label}>
              <div className="flex flex-col items-center">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 min-w-[52px] sm:min-w-[70px] md:min-w-[90px]">
                  <span className="text-xl sm:text-3xl md:text-5xl font-bold text-white tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-neutral-600 uppercase tracking-wider sm:tracking-widest mt-1.5 sm:mt-2">
                  {item.label}
                </span>
              </div>
              {index < 3 && (
                <span className="text-xl sm:text-3xl md:text-5xl font-light text-neutral-700 self-start mt-2 sm:mt-3 md:mt-4">
                  :
                </span>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0"
        >
          <a
            href="https://sodbd2.pics/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white text-black text-sm sm:text-base font-medium hover:bg-neutral-200 transition-colors"
          >
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            เยี่ยมชมเว็บไซต์หลัก
          </a>
          <a
            href="https://www.instagram.com/sodbd2_jpeg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-black border border-white/20 text-white text-sm sm:text-base font-medium hover:bg-white/10 transition-colors"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            ติดตามเราบน Instagram
          </a>
        </motion.div>
      </div>

      {/* Footer / Copyright */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">SodChatbot</span>
              <span className="text-neutral-600 text-sm">|</span>
              <span className="text-neutral-500 text-sm">โดย ฝ่ายโสตบดินทร 2</span>
            </div>
            <div className="text-neutral-600 text-sm">
              © 2025 SodChatbot By SodBodin2. สงวนลิขสิทธิ์ทุกประการ
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://sodbd2.pics/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors text-sm"
              >
                เว็บไซต์หลัก
              </a>
              <a
                href="https://www.instagram.com/sodbd2_jpeg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors text-sm"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
