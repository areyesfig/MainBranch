"use client";

import Link from "next/link";
import { Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { useNotificationPreferences } from "@/contexts/NotificationContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedStacks } = useNotificationPreferences();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
          >
            <span>Main Branch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Inicio
            </Link>
            <Link
              href="/releases"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Lanzamientos
            </Link>
            <Link
              href="/notifications"
              className="flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <span className="relative inline-flex">
                <Bell className="h-5 w-5" />
                {selectedStacks.length > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    {selectedStacks.length}
                  </span>
                )}
              </span>
              Notificaciones
            </Link>
            <Link
              href="/timeline"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Timeline
            </Link>
            <Link
              href="/roadmap"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Roadmap
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Acerca de
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/releases"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Lanzamientos
              </Link>
              <Link
                href="/notifications"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="h-4 w-4" />
                Notificaciones
                {selectedStacks.length > 0 && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                    {selectedStacks.length}
                  </span>
                )}
              </Link>
              <Link
                href="/timeline"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Timeline
              </Link>
              <Link
                href="/roadmap"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Roadmap
              </Link>
              <Link
                href="/about"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Acerca de
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
