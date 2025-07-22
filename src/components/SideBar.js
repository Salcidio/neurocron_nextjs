"use client";

import { useState } from "react";
import {
  Home,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Sparkles, // Kept for the main logo in SidebarItem if needed elsewhere
  Menu, // For the collapsed state toggle icon
  ChevronLeft, // For the expanded state toggle icon
  Compass, // For Explore
  History, // For History
  Star, // For Favorites
} from "lucide-react";
import Link from "next/link";

export default function Sidebar({ onSignOut }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`h-screen bg-black/80 border-r border-blue-500/20 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top section - Logo and Toggle Button */}
      <div>
        <button
          className="flex items-center justify-center w-full py-4 hover:bg-blue-900/20 transition cursor-pointer"
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <Menu className="text-blue-400" size={28} /> // Icon when collapsed
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="text-white ml-auto" size={24} />{" "}
              {/* Icon when expanded */}
            </div>
          )}
        </button>
        <nav className="mt-8 flex flex-col gap-2">
          <SidebarItem
            icon={<Home size={22} />}
            label="Home"
            collapsed={collapsed}
            href="/"
          />
          <SidebarItem
            icon={<MessageCircle size={22} />}
            label="Chat"
            collapsed={collapsed}
            href="/chat"
          />
          {/* New items from the image */}
          <SidebarItem
            icon={<Compass size={22} />}
            label="Explore"
            collapsed={collapsed}
            href="/explore" // Assuming a route /explore
          />
          <SidebarItem
            icon={<History size={22} />}
            label="History"
            collapsed={collapsed}
            href="/history" // Assuming a route /history
          />
          <SidebarItem
            icon={<Star size={22} />}
            label="Favorites"
            collapsed={collapsed}
            href="/favorites" // Assuming a route /favorites
          />
        </nav>
      </div>
      {/* Bottom section */}
      <div className="flex flex-col gap-2 mb-6">
        <SidebarItem
          icon={<User size={22} />}
          label="Profile"
          collapsed={collapsed}
          href="/profile"
        />
        <SidebarItem
          icon={<Settings size={22} />}
          label="Settings"
          collapsed={collapsed}
          href="/settings"
        />
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-6 py-3 text-red-400 hover:bg-red-900/20 transition w-full"
        >
          <LogOut size={22} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, collapsed, href }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-6 py-3 text-white hover:bg-blue-900/20 transition"
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}