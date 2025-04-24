// components/Sidebar.js
"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  HomeIcon,
  PowerIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: HomeIcon },
  { name: "Attendance", href: "/user/attendance", icon: UserGroupIcon },
  { name: "Sections", href: "/admin/sections", icon: UserGroupIcon },
];

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const isActive = (path) => router.pathname === path;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-white bg-slate-800 rounded-lg shadow"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="lg:hidden relative z-50" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-50">
            <Dialog.Panel className="relative w-64 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">User Panel</h2>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                </button>
              </div>
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.href)
                        ? "bg-black/10 text-primary"
                        : "hover:bg-black/10 text-gray-800"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => router.push("/user/login")}
                  className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-100 rounded-md"
                >
                  <PowerIcon className="h-5 w-5" />
                  Logout
                </button>
              </nav>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col h-screen bg-white border-r shadow-md p-6">
        <div className="mb-4 text-xl font-bold text-primary">User Panel</div>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.href)
                  ? "bg-black/10 text-primary"
                  : "hover:bg-black/10 text-gray-800"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => router.push("/user/login")}
            className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-100 rounded-md"
          >
            <PowerIcon className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}
