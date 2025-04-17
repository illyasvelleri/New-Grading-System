import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: HomeIcon },
  { name: "Profile", href: "/user/profile", icon: HomeIcon },
  { name: "Sections", href: "/user/sections", icon: HomeIcon },
];

export default function UserSidebar() {

  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <>
      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-slate-800 text-white py-2 rounded-t-2xl shadow-md lg:hidden">
        {navigation.map((item) => (
          <Link
          key={item.name}
          href={item.href}
          className={`flex flex-col items-center text-xs transition-all duration-300 ease-in-out
            ${isActive(item.href) ? 'text-green-400' : 'text-white/70'}`}
        >
          <div
            className="p-3 rounded-full hover:bg-green-400/10 hover:animate-curve"
          >
            <item.icon className={`h-6 w-6 ${isActive(item.href) ? 'text-green-400' : 'text-white/70'}`} />
          </div>
          <span className={`text-[11px] mt-1 ${isActive(item.href) ? 'text-green-400' : 'text-white/60'}`}>
            {item.name}
          </span>
        </Link>
        
        ))}
        <button
          onClick={() => router.push("/user/login")}
          className="flex flex-col items-center text-xs text-red-400"
        >
          <PowerIcon className="h-6 w-6 mb-1" />
          Logout
        </button>
      </div>


      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:h-full bg-white/70 p-6 shadow-xl rounded-2xl text-accent/70">

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-primary">User Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${isActive(item.href)
                  ? "bg-black/10 text-primary"
                  : "hover:bg-black/10 text-white/90"
                }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => router.push("/user/login")}
            className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-100/10 rounded-md transition"
          >
            <PowerIcon className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}
