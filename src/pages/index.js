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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Hero Section */}
      <section className="relative min-h-[92vh] px-6 sm:px-10 pt-24 pb-36 text-white bg-spotlight-dark shadow-inner overflow-hidden">
        {/* Login Dropdown - Top Right */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-50">
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
                  className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden border"
                >
                  <a
                    href="/user/login"
                    className="block px-4 py-3 hover:bg-gray-100 transition-all"
                  >
                    🙍‍♂️ User Login
                  </a>
                  <a
                    href="/"
                    className="block px-4 py-3 hover:bg-gray-100 transition-all"
                  >
                    📚 Usthadh Login
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
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

      {/* <section className="relative min-h-[92vh] bg-white px-6 sm:px-10 pt-24 pb-36 text-gray-900">
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
      </section> */}
      <section className="relative min-h-[92vh] bg-white px-6 sm:px-10 pt-24 pb-36 text-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="space-y-6 sm:space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5 text-[#10b981]">
              Suhba: Uniting 35+ Darses Under One Vision
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl">
              Suhba serves as the unifying body for over 35 affiliated Darses, all under the guidance of Alathurpadi Dars. Together, these Darses work harmoniously to offer a blend of traditional teachings and modern academic excellence, enriching the lives of students and the community.
            </p>
            <p className="text-md sm:text-lg text-gray-600 italic">
              "Educating over 200 students, Suhba is a sanctuary where knowledge meets spirituality, fostering a strong sense of community among its affiliated Darses."
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#10b981] hover:bg-[#064e3b] text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg hover:scale-105">
                ✨ Begin Your Journey
              </button>
              <a href="https://alathurpadidars.in/" target="_blank" rel="noopener noreferrer" className="text-[#10b981] hover:text-[#064e3b] font-semibold">
                Visit Official Website
              </a>
            </div>
          </motion.div>

          {/* Right Column - Image + Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="relative flex flex-col items-center"
          >
            {/* Main Image */}
            <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden shadow-lg mb-8">
              <img
                src="/images/open-book-wooden-table.avif"
                alt="Students in Suhba Dars"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cards below image */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {[
                {
                  title: "Qur’an Recitation",
                  icon: "📖",
                  color: "bg-[#ecfdf5]",
                },
                {
                  title: "Hadith Learning",
                  icon: "🕌",
                  color: "bg-[#fefce8]",
                },
                {
                  title: "Tarbiyyah Programs",
                  icon: "🌙",
                  color: "bg-[#f3f4f6]",
                }
              ].map((item, index) => (
                <div key={index} className={`p-4 rounded-xl shadow-md text-center ${item.color}`}>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      <section className="bg-[#10b981] py-12 text-center text-white">
    <h2 className="text-3xl font-semibold mb-4">Start Your Journey Today</h2>
    <p className="mb-6 text-lg">Join a community of learners and elevate your knowledge with us.</p>
    <button className="px-6 py-3 bg-white text-[#10b981] rounded-lg hover:bg-[#064e3b] transition-all">
        Get Started
    </button>
</section>




<section className="bg-white py-16 px-6 sm:px-12 text-gray-800">
  {/* Big Artistic Heading */}
  <div className="relative text-center mb-16">
    <h2 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#064e3b]">
      Diverse Areas of Knowledge & Growth
    </h2>
    <p className="text-gray-600 text-base mt-4 max-w-2xl mx-auto">
      Suhba blends Islamic heritage with modern advancement, empowering students to thrive spiritually and academically.
    </p>
  </div>

  {/* Animated Scrolling Section */}
  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
  {[
    {
      title: "Qur’anic Studies",
      desc: "Deep understanding of the Qur’an, its sciences, and meanings.",
      icon: "📖",
    },
    {
      title: "Modern Degrees",
      desc: "Merging traditional knowledge with modern academics.",
      icon: "🎓",
    },
    {
      title: "Coding & Creative Skills",
      desc: "Learn coding, design, and web development for today’s world.",
      icon: "💻",
    },
  ].map((item, i) => (
    <div
      key={i}
      data-aos="zoom-in"
      data-aos-delay={i * 100}
      className="bg-gradient-to-tr from-[#f0fdfa] via-white to-[#f0fdfa] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-default"
    >
      <div className="text-5xl mb-4 text-[#10b981] group-hover:scale-110 transition-transform">
        {item.icon}
      </div>
      <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{item.title}</h3>
      <p className="text-gray-600 text-base">{item.desc}</p>
    </div>
  ))}
</div>


  {/* Image Cards with Overlay Text */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {[
      { title: "Qur'an Studies", image: "/images/open-book-wooden-table.avif", description: "Deep dive into the sciences and understanding of the Qur’an." },
      { title: "Seerah & Hadith", image: "/images/open-book-wooden-table.avif", description: "Explore the life of Prophet Muhammad (PBUH) and his teachings." },
      { title: "Islamic Laws", image: "/images/open-book-wooden-table.avif", description: "Understand Islamic jurisprudence and its applications." },
    ].map((item, i) => (
      <div key={i} className="relative overflow-hidden rounded-xl">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-72 object-cover transition-all duration-300 ease-in-out transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
          <h3 className="text-2xl font-semibold text-white mb-2">{item.title}</h3>
          <p className="text-white text-base">{item.description}</p>
        </div>
      </div>
    ))}
  </div>
</section>








      <footer className="bg-[#10b981] text-white py-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2025 Suhab. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-[#064e3b]">Contact</a>
          </div>
        </div>
      </footer>

    </div>

  );
}
