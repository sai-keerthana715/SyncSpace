// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserPlus,
  Bell,
  MessageSquare,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/manage-users", label: "Manage Users", icon: Users },
    { to: "/admin/create-workspace", label: "Create Workspace", icon: Briefcase },
    { to: "/admin/assign-workspace", label: "Assign Workspace", icon: UserPlus },
    { to: "/admin/notifications", label: "Notifications", icon: Bell },
    { to: "/admin/chat", label: "Chat", icon: MessageSquare },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="h-screen w-64 bg-indigo-700 text-white flex flex-col justify-between shadow-xl fixed">
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
