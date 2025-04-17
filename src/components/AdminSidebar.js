import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  HomeIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Users", href: "/admin/users/get-users", icon: UserGroupIcon },
  { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-64 flex-col bg-white shadow-xl pb-4 pt-5">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-bold">Admin</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <XMarkIcon className="h-6 w-6 text-gray-700" />
                  </button>
                </div>
                <nav className="mt-6 space-y-1 px-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive(item.href)
                          ? "bg-gray-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => router.push("/admin/login")}
                    className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <PowerIcon className="h-5 w-5" />
                    Logout
                  </button>
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-gray-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => router.push("/admin/login")}
            className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-md"
          >
            <PowerIcon className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Mobile Hamburger */}
      <div className="lg:hidden p-4">
        <button onClick={() => setSidebarOpen(true)}>
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </>
  );
}
