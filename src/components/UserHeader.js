// components/admin-sidebar.js
import { useRouter } from 'next/router';

export default function UserHeader() {
  const router = useRouter();

  return (
    <div className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left side: Title or breadcrumb */}
      <h1 className="text-xl font-semibold text-primary">User Dashboard</h1>

      {/* Right side: Profile, Notifications, Logout */}
      <div className="flex items-center gap-4">
        {/* Notification bell (optional) */}
        <button className="relative">
          <i className="fas fa-bell text-gray-600 text-lg"></i>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User avatar/name */}
        <div className="flex items-center gap-2">
          <img src="/images/user.png" className="w-8 h-8 rounded-full object-cover" alt="User" />
          <span className="text-sm text-gray-700">Hi, Illyas</span>
        </div>
      </div>
    </div>

  );
}
