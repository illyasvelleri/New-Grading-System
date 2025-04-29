// import Image from "next/image";
// import { Geist, Geist_Mono } from "next/font/google";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// export default function Home() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const sections = [
//     {
//       title: "📚 The Light of Knowledge",
//       desc: "Suhba is where Deen meets discipline. We begin with the story of how knowledge was passed from generation to generation through Darses.",
//       bg: "bg-gradient-to-r from-green-100 to-white",
//     },
//     {
//       title: "🕌 Unity in Vision",
//       desc: "35+ Darses united under the visionary Alathurpadi system. Building brotherhood and ilm across generations.",
//       bg: "bg-gradient-to-r from-yellow-100 to-white",
//     },
//     {
//       title: "🎓 Holistic Learning",
//       desc: "From Qur’an to Hadith, from Tarbiyyah to community leadership – our Dars offers more than a syllabus, it offers a way of life.",
//       bg: "bg-gradient-to-r from-blue-100 to-white",
//     },
//     {
//       title: "🤝 Brotherhood Beyond Books",
//       desc: "Students grow not just in knowledge but in character. Living, praying, and serving together forms a bond that lasts a lifetime.",
//       bg: "bg-gradient-to-r from-pink-100 to-white",
//     },
//     {
//       title: "🌙 Your Journey Begins Here",
//       desc: "Begin your path to spiritual enlightenment and intellectual clarity. Join Suhba today and be a part of the light.",
//       bg: "bg-gradient-to-r from-gray-100 to-white",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white font-sans">

//       {/* Login */}
//       <div className="absolute top-6 right-6 z-50">
//         <div className="relative">
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="bg-[#10b981] hover:bg-[#064e3b] px-4 py-2 rounded-full text-white font-medium shadow-md transition-all"
//           >
//             🔐 Login
//           </button>

//           <AnimatePresence>
//             {dropdownOpen && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border"
//               >
//                 <a href="/user/dashboard" className="block px-4 py-3 hover:bg-gray-100 hover:rounded-xl transition-all">
//                   🙍‍♂️ User Login
//                 </a>
//                 <a href="/" className="block px-4 py-3 hover:bg-gray-100 hover:rounded-xl transition-all">
//                   📚 Student Portal
//                 </a>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//      {/* Hero Section */}
//      <section className="min-h-screen px-6 pt-24 pb-36 text-white bg-[#111827] flex flex-col items-center justify-center text-center relative overflow-hidden">
//         <Image
//           src="/images/qur'an-hero.png"
//           alt="Background pattern"
//           layout="fill"
//           objectFit="cover"
//           className="absolute inset-0 w-full h-full opacity-10 z-0"
//         />
//         <div className="relative z-10">
//           <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up">
//             <span className="text-[#10b981]">Suhba</span> – The Spirit of Dars
//           </h1>
//           <p className="text-lg text-gray-300 max-w-xl italic animate-fade-up delay-100">
//             “Illuminating minds and hearts with sacred knowledge.”
//           </p>
//           <button className="mt-10 bg-[#10b981] hover:bg-[#064e3b] text-white px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 transition-all animate-fade-up delay-200">
//             ✨ Begin Your Journey
//           </button>
//         </div>
//       </section>

//       {/* Story Sections */}
//       {sections.map((sec, index) => (
//         <section
//           key={index}
//           className={`min-h-[80vh] px-6 sm:px-10 pt-20 pb-24 text-gray-900 ${sec.bg}`}
//         >
//           <div className="max-w-5xl mx-auto text-center">
//             <motion.h2
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-3xl sm:text-4xl font-bold mb-6"
//             >
//               {sec.title}
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-lg max-w-3xl mx-auto text-gray-700"
//             >
//               {sec.desc}
//             </motion.p>
//           </div>
//         </section>
//       ))}
//     </div>
//   );
// }



import Image from "next/image";
import { Geist } from "next/font/google";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sections = [
    {
      title: "The Light of Knowledge",
      desc: "Suhba is where Deen meets discipline. We begin with the story of how knowledge was passed from generation to generation through Darses.",
      img: "/images/knowledge.jpg",
      badge: "Foundational Learning",
      bg: "bg-gradient-to-r from-green-50 to-white",
    },
    {
      title: "Unity in Vision",
      desc: "35+ Darses united under the visionary Alathurpadi system. Building brotherhood and ilm across generations.",
      img: "/images/unity.jpg",
      badge: "Community Strength",
      bg: "bg-gradient-to-r from-yellow-50 to-white",
    },
    {
      title: "Holistic Learning",
      desc: "From Qur’an to Hadith, from Tarbiyyah to community leadership – our Dars offers more than a syllabus, it offers a way of life.",
      img: "/images/learning.jpg",
      badge: "Comprehensive Education",
      bg: "bg-gradient-to-r from-blue-50 to-white",
    },
    {
      title: "Brotherhood Beyond Books",
      desc: "Students grow not just in knowledge but in character. Living, praying, and serving together forms a bond that lasts a lifetime.",
      img: "/images/brotherhood.jpg",
      badge: "Lifelong Bonds",
      bg: "bg-gradient-to-r from-pink-50 to-white",
    },
    {
      title: "Your Journey Begins Here",
      desc: "Begin your path to spiritual enlightenment and intellectual clarity. Join Suhba today and be a part of the light.",
      img: "/images/journey.jpg",
      badge: "Start Now",
      bg: "bg-gradient-to-r from-gray-50 to-white",
    },
  ];

  return (
    <div className={`min-h-screen bg-white font-sans ${geist.variable}`}>
      {/* Login Dropdown */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            aria-label="Toggle login dropdown"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Login
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100"
              >
                <a
                  href="/user/dashboard"
                  className="block px-4 py-3 text-sm hover:bg-green-50 hover:rounded-xl transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  User Login
                </a>
                <a
                  href="/"
                  className="block px-4 py-3 text-sm hover:bg-green-50 hover:rounded-xl transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Student Portal
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen px-6 pt-24 pb-36 flex flex-col items-center justify-center text-center text-white bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <Image
          src="/images/quran-hero.jpg"
          alt="Qur'an study background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 opacity-20 z-0"
          priority
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 shadow-md"
          >
            Sacred Knowledge
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
          >
            <span className="text-green-400">Suhba</span> – The Spirit of Dars
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto italic"
          >
            “Illuminating minds and hearts with sacred knowledge.”
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Begin Your Journey
          </motion.button>
        </div>
      </section>

      {/* Story Sections */}
      {sections.map((sec, index) => (
        <section
          key={index}
          className={`min-h-[80vh] px-6 sm:px-10 pt-20 pb-24 flex items-center justify-center ${sec.bg}`}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-64 md:h-96 rounded-2xl shadow-lg overflow-hidden"
            >
              <Image
                src={sec.img}
                alt={sec.title}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {sec.badge}
              </div>
            </motion.div>
            <div className="text-center md:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                {sec.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-gray-700 max-w-xl mx-auto md:mx-0"
              >
                {sec.desc}
              </motion.p>
              <motion.a
                href="#join"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full font-medium hover:bg-green-200 hover:shadow-md transition-all duration-200"
              >
                Learn More
              </motion.a>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
