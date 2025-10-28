import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Bell,
  MessageSquare,
  LogOut,
} from "lucide-react";

export default function MemberSidebar() {
  const location = useLocation();

  const links = [
    { to: "/member/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/member/workspaces", label: "My Workspaces", icon: Briefcase },
    { to: "/member/notifications", label: "Notifications", icon: Bell },
    { to: "/member/chat", label: "Chat with Admin", icon: MessageSquare },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-indigo-700 text-white flex flex-col justify-between shadow-lg">
      <div>
        <h1 className="text-2xl font-bold text-center mt-6 mb-8">SyncSpace</h1>
        <nav className="flex flex-col space-y-2 px-4">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-3 py-2 rounded-lg hover:bg-indigo-600 transition ${
                location.pathname === to ? "bg-indigo-600" : ""
              }`}
            >
              <Icon size={18} className="mr-3" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-4 py-6 border-t border-indigo-500">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
