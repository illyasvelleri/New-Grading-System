'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import { PowerIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/user/dashboard', icon: FaHome },
  { name: 'Profile', href: '/profile', icon: FaUser },
  { name: 'Settings', href: '/settings', icon: FaCog },
];

const UserHeader = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) => pathname === href;


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 z-50 hidden lg:flex lg:w-64 flex-col h-screen bg-white border-r p-6 shadow-sm">
        {/* Header */}
        <div className="text-xl font-bold text-gray-800 mb-6">User Panel</div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(item.href)
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t mt-auto">
          <button
            onClick={() => router.push("/user/login")}
            className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-100 rounded-lg"
          >
            <PowerIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-gradient-to-tr from-[#0f172a] via-black to-[#1e293b] text-white py-3 rounded-t-3xl shadow-lg lg:hidden backdrop-blur-md border-t border-sky-800/30">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center text-xs font-medium transition-all duration-300 ease-in-out
      ${isActive(item.href) ? 'text-emerald-400' : 'text-white/60'}`}
          >
            <div className={`p-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-110
        ${isActive(item.href) ? 'bg-emerald-500/10' : 'hover:bg-sky-400/10'}`}>
              <item.icon
                className={`h-6 w-6 transition-all duration-300
          ${isActive(item.href) ? 'text-emerald-400' : 'text-white/70'}`}
              />
            </div>
            <span
              className={`mt-1 text-[11px] transition-all duration-300
        ${isActive(item.href) ? 'text-emerald-400' : 'text-white/50'}`}
            >
              {item.name}
            </span>
          </Link>
        ))}

        {/* Logout */}
        <button
          onClick={() => router.push("/user/login")}
          className="flex flex-col items-center text-xs text-red-400 hover:text-red-300 transition-all duration-300 ease-in-out transform hover:scale-110"
        >
          <PowerIcon className="h-6 w-6 mb-1" />
          Logout
        </button>
      </div>


    </>
  );
};

export default UserHeader;
