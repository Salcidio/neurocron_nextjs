"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Compass,
  History,
  BrainCircuit,
  Star,
  BarChart2,
} from "lucide-react";
import {
  Home as HomeFill,
  MessageCircle as MessageCircleFill,
  Compass as CompassFill,
  History as HistoryFill,
  Star as StarFill,
  User as UserFill,
  Settings as SettingsFill,
} from "lucide-react"; // Swap for filled icons if custom

export default function Sidebar({ onSignOut }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between transition-all duration-500 ease-in-out overflow-hidden z-50 ${
        collapsed ? "w-16" : "w-64"
      } shadow-2xl`}
    >
      <div>
        <button
          className="flex items-center justify-center w-full py-4 hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <Menu
              className="text-purple-400 transition-all duration-300"
              size={24}
            />
          ) : (
            <div className="flex items-center justify-end px-4">
              <ChevronLeft
                className="text-white transition-all duration-300"
                size={24}
              />
            </div>
          )}
        </button>

        <nav className="mt-8 flex flex-col gap-2">
          <SidebarItem
            IconOutlined={Home}
            IconFilled={HomeFill}
            label="Home"
            collapsed={collapsed}
            href="/"
          />
          <SidebarItem
            IconOutlined={MessageCircle}
            IconFilled={MessageCircleFill}
            label="chat"
            collapsed={collapsed}
            href="/chat"
          />
          <SidebarItem
            IconOutlined={Compass}
            IconFilled={CompassFill}
            label="Predictor"
            collapsed={collapsed}
            href="/pd-predictor"
          />
          <SidebarItem
            IconOutlined={BrainCircuit}
            IconFilled={BrainCircuit}
            label="MRI"
            collapsed={collapsed}
            href="/mri"
          />
          <SidebarItem
            IconOutlined={BarChart2}
            IconFilled={BarChart2}
            label="Analysis"
            collapsed={collapsed}
            href="/analysis"
          />
        </nav>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <SidebarItem
          IconOutlined={User}
          IconFilled={UserFill}
          label="Profile"
          collapsed={collapsed}
          href="/profile"
        />
        <SidebarItem
          IconOutlined={Settings}
          IconFilled={SettingsFill}
          label="Settings"
          collapsed={collapsed}
          href="/settings"
        />
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-6 py-3 text-red-400 hover:bg-red-900/20 transition w-full"
        >
          <span className="w-6 flex justify-center items-center">
            <LogOut size={20} />
          </span>
          {!collapsed && (
            <span className="transition-opacity duration-300">Sign Out</span>
          )}
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ IconOutlined, IconFilled, label, collapsed, href }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-6 py-3 text-white hover:bg-white/10 hover:text-purple-300 transition-all duration-300 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="w-6 flex justify-center items-center transition-transform duration-300">
        {hovered ? <IconFilled size={20} /> : <IconOutlined size={20} />}
      </span>
      <span
        className={`transition-opacity duration-300 ${
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
