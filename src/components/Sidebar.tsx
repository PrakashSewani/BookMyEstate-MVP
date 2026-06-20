"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    {
      href: "/feed",
      label: "Feed",
      icon: (active: boolean) => (
        <svg className="w-5 h-5 shrink-0" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      href: "/liked",
      label: "Liked",
      icon: (active: boolean) => (
        <svg className="w-5 h-5 shrink-0" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      href: "/saved",
      label: "Saved",
      icon: (active: boolean) => (
        <svg className="w-5 h-5 shrink-0" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
      ),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: (active: boolean) => (
        <svg className="w-5 h-5 shrink-0" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
  ];

  if (user.role === "ADMIN") {
    links.push({
      href: "/admin",
      label: "Admin",
      icon: (active: boolean) => (
        <svg className="w-5 h-5 shrink-0" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    });
  }

  const sidebarWidth = collapsed ? "w-[60px]" : "w-[200px]";

  return (
    <>
      {/* Mobile trigger — shifts when sidebar opens */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={`fixed top-3 z-[55] w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-brand-950 font-bold text-sm shadow-lg transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? "left-[212px]" : "left-3"
        }`}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${mobileOpen ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full z-50 bg-brand-950 border-r border-white/[0.06] flex flex-col transition-all duration-200 ease-out ${
          sidebarWidth
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header — logo + collapse */}
        <div className={`h-12 flex items-center border-b border-white/[0.06] ${collapsed ? "justify-center px-2" : "px-4 justify-between"}`}>
          <Link href="/feed" className="flex items-center gap-2 shrink-0">
            {!collapsed && (
              <span className="text-sm font-bold tracking-tight text-white">
                <span className="text-gold-400">Book</span>MyEstate
              </span>
            )}
            {collapsed && (
              <span className="text-xs font-bold text-gold-400">B</span>
            )}
          </Link>

          {/* Desktop collapse/expand */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded text-brand-500 hover:text-brand-200 hover:bg-white/5 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg transition-colors duration-100 ${
                  collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"
                } ${
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-brand-400 hover:text-white hover:bg-white/[0.04]"
                }`}
                title={collapsed ? link.label : undefined}
              >
                {link.icon(isActive)}
                {!collapsed && (
                  <span className="text-[13px] font-medium truncate">{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className={`border-t border-white/[0.06] p-2 space-y-0.5`}>
          {!collapsed && (
            <div className="px-3 py-2">
              <div className="text-[12px] text-white font-medium truncate">{user.name || user.email}</div>
              <div className="text-[11px] text-brand-500 truncate">{user.email}</div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={`flex items-center gap-2.5 rounded-lg text-brand-400 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors w-full ${
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"
            }`}
            title={collapsed ? "Logout" : undefined}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {!collapsed && <span className="text-[13px] font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
