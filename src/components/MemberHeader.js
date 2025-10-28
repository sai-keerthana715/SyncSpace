import React from "react";
import { Bell } from "lucide-react";

export default function MemberHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-3 sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-gray-700">Member Panel</h2>
      <div className="flex items-center space-x-4">
        <Bell className="text-gray-600 cursor-pointer" />
        <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
          {user?.name?.[0]?.toUpperCase() || "M"}
        </div>
      </div>
    </header>
  );
}
