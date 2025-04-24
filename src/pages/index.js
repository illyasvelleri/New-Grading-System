import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sections = [
    {
      title: "📚 The Light of Knowledge",
      desc: "Suhba is where Deen meets discipline. We begin with the story of how knowledge was passed from generation to generation through Darses.",
      bg: "bg-gradient-to-r from-green-100 to-white",
    },
    {
      title: "🕌 Unity in Vision",
      desc: "35+ Darses united under the visionary Alathurpadi system. Building brotherhood and ilm across generations.",
      bg: "bg-gradient-to-r from-yellow-100 to-white",
    },
    {
      title: "🎓 Holistic Learning",
      desc: "From Qur’an to Hadith, from Tarbiyyah to community leadership – our Dars offers more than a syllabus, it offers a way of life.",
      bg: "bg-gradient-to-r from-blue-100 to-white",
    },
    {
      title: "🤝 Brotherhood Beyond Books",
      desc: "Students grow not just in knowledge but in character. Living, praying, and serving together forms a bond that lasts a lifetime.",
      bg: "bg-gradient-to-r from-pink-100 to-white",
    },
    {
      title: "🌙 Your Journey Begins Here",
      desc: "Begin your path to spiritual enlightenment and intellectual clarity. Join Suhba today and be a part of the light.",
      bg: "bg-gradient-to-r from-gray-100 to-white",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Login */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#10b981] hover:bg-[#064e3b] px-4 py-2 rounded-full text-white font-medium shadow-md transition-all"
          >
            🔐 Login
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border"
              >
                <a href="/user/dashboard" className="block px-4 py-3 hover:bg-gray-100 hover:rounded-xl transition-all">
                  🙍‍♂️ User Login
                </a>
                <a href="/" className="block px-4 py-3 hover:bg-gray-100 hover:rounded-xl transition-all">
                  📚 Student Portal
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

     {/* Hero Section */}
     <section className="min-h-screen px-6 pt-24 pb-36 text-white bg-[#111827] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <Image
          src="/images/qur'an-hero.png"
          alt="Background pattern"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 w-full h-full opacity-10 z-0"
        />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up">
            <span className="text-[#10b981]">Suhba</span> – The Spirit of Dars
          </h1>
          <p className="text-lg text-gray-300 max-w-xl italic animate-fade-up delay-100">
            “Illuminating minds and hearts with sacred knowledge.”
          </p>
          <button className="mt-10 bg-[#10b981] hover:bg-[#064e3b] text-white px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 transition-all animate-fade-up delay-200">
            ✨ Begin Your Journey
          </button>
        </div>
      </section>

      {/* Story Sections */}
      {sections.map((sec, index) => (
        <section
          key={index}
          className={`min-h-[80vh] px-6 sm:px-10 pt-20 pb-24 text-gray-900 ${sec.bg}`}
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold mb-6"
            >
              {sec.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg max-w-3xl mx-auto text-gray-700"
            >
              {sec.desc}
            </motion.p>
          </div>
        </section>
      ))}
    </div>
  );
}