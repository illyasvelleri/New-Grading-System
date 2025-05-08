// // components/Sidebar.js
// "use client";
// import { Fragment, useState } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import {
//     HomeIcon,
//     PowerIcon,
//     UserGroupIcon,
//     Bars3Icon,
//     XMarkIcon,
// } from "@heroicons/react/24/outline";
// import Link from "next/link";
// import { useRouter } from "next/router";

// const navigation = [
//     { name: "Dashboard", href: "/user/student-portal/dashboard", icon: HomeIcon },
//     { name: "Students", href: "/user/student-portal/students", icon: UserGroupIcon },
//     { name: "Activities", href: "/user/student-portal/activities", icon: UserGroupIcon },
//     { name: "Attendance", href: "/user/student-portal/attendance", icon: UserGroupIcon },
//     { name: "Exam", href: "/user/student-portal/exam", icon: UserGroupIcon }
// ];

// export default function StudentPortalSidebar(){
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const router = useRouter();
//     const isActive = (path) => router.pathname === path;

//     return (
//         <>
//             {/* Modern Mobile Toggle Button */}
//             <div className="lg:hidden fixed top-4 right-4 z-50">
//                 <button
//                     onClick={() => setMobileMenuOpen(true)}
//                     className="inline-flex items-center justify-center rounded-xl bg-neutral-900 text-white p-2 shadow-md transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white"
//                     aria-label="Open menu"
//                 >
//                     <Bars3Icon className="h-6 w-6 transition-transform duration-200" />
//                 </button>
//             </div>


//             {/* Mobile Sidebar */}
//             <Transition.Root show={mobileMenuOpen} as={Fragment}>
//                 <Dialog as="div" className="lg:hidden relative z-50" onClose={setMobileMenuOpen}>
//                     <Transition.Child
//                         as={Fragment}
//                         enter="transition-opacity ease-linear duration-200"
//                         enterFrom="opacity-0"
//                         enterTo="opacity-100"
//                         leave="transition-opacity ease-linear duration-200"
//                         leaveFrom="opacity-100"
//                         leaveTo="opacity-0"
//                     >
//                         <div className="fixed inset-0 bg-black bg-opacity-50" />
//                     </Transition.Child>

//                     <div className="fixed inset-0 flex justify-end">
//                         <Dialog.Panel className="relative w-64 bg-white p-6 shadow-xl flex flex-col justify-between">
//                             {/* Header */}
//                             <div>
//                                 <div className="flex items-center justify-between mb-6">
//                                     <h2 className="text-xl font-bold text-gray-800 tracking-tight">Admin Panel</h2>
//                                     <button onClick={() => setMobileMenuOpen(false)}>
//                                         <XMarkIcon className="h-6 w-6 text-gray-600" />
//                                     </button>
//                                 </div>

//                                 {/* Navigation */}
//                                 <nav className="space-y-1">
//                                     {navigation.map((item) => (
//                                         <Link
//                                             key={item.name}
//                                             href={item.href}
//                                             className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(item.href)
//                                                 ? "bg-emerald-50 text-emerald-600"
//                                                 : "text-gray-600 hover:bg-gray-100"
//                                                 }`}
//                                         >
//                                             <item.icon className="h-5 w-5" />
//                                             {item.name}
//                                         </Link>
//                                     ))}
//                                 </nav>
//                             </div>

//                             {/* Logout */}
//                             <button
//                                 onClick={() => router.push("/user/login")}
//                                 className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-100 rounded-lg"
//                             >
//                                 <PowerIcon className="h-5 w-5" />
//                                 Logout
//                             </button>
//                         </Dialog.Panel>
//                     </div>
//                 </Dialog>
//             </Transition.Root>

//             {/* Desktop Sidebar */}
//             <aside className="hidden lg:flex lg:w-64 flex-col h-screen bg-white border-r p-6 shadow-sm">
//                 {/* Header */}
//                 <div className="text-xl font-bold text-gray-800 mb-6">Admin Panel</div>

//                 {/* Navigation */}
//                 <nav className="flex-1 space-y-1">
//                     {navigation.map((item) => (
//                         <Link
//                             key={item.name}
//                             href={item.href}
//                             className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(item.href)
//                                 ? "bg-emerald-50 text-emerald-600"
//                                 : "text-gray-600 hover:bg-gray-100"
//                                 }`}
//                         >
//                             <item.icon className="h-5 w-5" />
//                             {item.name}
//                         </Link>
//                     ))}
//                 </nav>

//                 {/* Logout */}
//                 <div className="pt-4 border-t mt-auto">
//                     <button
//                         onClick={() => router.push("/user/login")}
//                         className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-100 rounded-lg"
//                     >
//                         <PowerIcon className="h-5 w-5" />
//                         Logout
//                     </button>
//                 </div>
//             </aside>
//         </>

//     );
// }


"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // or use Heroicons
import { useRouter } from "next/router";
import Link from "next/link";

const menuItems = [
  { label: "Dashboard", href: "/user/student-portal/dashboard", icon: "home" },
  { label: "Students", href: "/user/student-portal/students", icon: "users" },
  { label: "Activities", href: "/user/student-portal/activities", icon: "activity" },
  { label: "Attendance", href: "/user/student-portal/attendance", icon: "calendar" },
  { label: "Exam", href: "/user/student-portal/exam", icon: "file-text" }
];

export default function StudentPortalSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isActive = (href) => router.pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-indigo-600 text-white p-2 rounded-full shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:relative lg:translate-x-0 lg:shadow-lg`}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white p-1"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-indigo-400 border-opacity-30">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 19l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <h1 className="ml-3 text-xl font-bold">EduTrack</h1>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                    isActive(item.href)
                      ? "bg-white bg-opacity-20 text-white font-medium"
                      : "text-indigo-100 hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-8">
                    <i className={`fas fa-${item.icon}`}></i>
                  </span>
                  <span className="ml-3">{item.label}</span>
                  {isActive(item.href) && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center bg-indigo-800 bg-opacity-40 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-800 font-bold">
              
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-indigo-200"></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
