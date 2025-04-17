import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import { ArrowDown, Clock, BookOpen, Users, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [showCards, setShowCards] = useState(false);
  const toggleCards = () => setShowCards(!showCards);

  return (
    <div className="min-h-screen bg-white font-sans px-6">

    {/* Hero Section */}
    <section className="relative min-h-[92vh] px-6 sm:px-10 pt-24 pb-36 text-white bg-gray-900 rounded-br-[8vw] rounded-bl-[8vw] shadow-inner overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center sm:items-start text-center sm:text-left space-y-6 sm:space-y-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-md">
          Seek <span className="text-[#10b981] animate-pulse">Sacred Knowledge</span> with Guidance
        </h1>
  
        <p className="text-base sm:text-lg lg:text-xl text-[#d1d5db] max-w-2xl leading-relaxed flex flex-wrap justify-center sm:justify-start gap-3">
          <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-white/90 font-medium backdrop-blur-sm">
            📖 Qur’anic Sciences
          </span>
          <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-white/90 font-medium backdrop-blur-sm">
            🕌 Prophetic Teachings
          </span>
          <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-white/90 font-medium backdrop-blur-sm">
            🕋 Islamic Values
          </span>
        </p>
  
        <p className="text-sm sm:text-base lg:text-lg text-[#e5e7eb] italic max-w-xl">
          “Educating <span className="text-[#10b981] font-semibold">450+</span> students with the light of Deen – every single day.”
        </p>
  
        <button className="bg-[#10b981] hover:bg-[#064e3b] text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg hover:scale-105">
          ✨ Begin Your Journey of ‘Ilm
        </button>
      </div>
    </section>
  
    {/* Revealed Cards Section with Scroll Animation */}
    <section className="relative min-h-[92vh] bg-white px-6 sm:px-10 pt-24 pb-36 text-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="max-w-5xl mx-auto text-center sm:text-left space-y-6 sm:space-y-8"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5 text-[#10b981]">
          Suhba: Uniting 35+ Darses Under One Vision
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto sm:mx-0">
          Suhba serves as the unifying body for over 35 affiliated Darses, all under the guidance of Alathurpadi Dars. Together, these Darses work harmoniously to offer a blend of traditional teachings and modern academic excellence, enriching the lives of students and the community.
        </p>
        <p className="text-md sm:text-lg text-gray-600 italic">
          "Educating over 200 students, Suhba is a sanctuary where knowledge meets spirituality, fostering a strong sense of community among its affiliated Darses."
        </p>
        <div className="flex justify-center sm:justify-start gap-4">
          <button className="bg-[#10b981] hover:bg-[#064e3b] text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg hover:scale-105">
            ✨ Begin Your Journey
          </button>
          <a href="https://alathurpadidars.in/" target="_blank" rel="noopener noreferrer" className="text-[#10b981] hover:text-[#064e3b] font-semibold">
            Visit Official Website
          </a>
        </div>
      </motion.div>
    </section>
  
  </div>
  
  );
}
