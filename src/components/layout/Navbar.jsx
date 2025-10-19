"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { LogOut, LayoutDashboard, Calendar, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Ultra minimal */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="absolute top-0 left-0 w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
            </div>
            <span className="text-xl font-light tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
              Reservá5
            </span>
          </Link>

          {/* Desktop Navigation - Clean links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/canchas"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              Canchas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/reservar"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              Reservar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/mis-reservas"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              Mis Reservas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {status === "loading" && (
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-200"></div>
              </div>
            )}

            {status === "unauthenticated" && (
              <div className="flex items-center space-x-6">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all hover:scale-105"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {status === "authenticated" && (
              <div className="flex items-center space-x-4">
                {/* Admin Link - Minimal */}
                {session?.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* User Section - No button, just clean elements */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 hover:opacity-70 transition-opacity"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                        <span className="text-xs font-semibold text-white">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {session.user.role === "admin" && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown - Floating, minimal */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {session.user.email}
                        </p>
                        {session.user.role === "admin" && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                              Administrador
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {session?.user?.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-purple-600" />
                            <span>Panel Admin</span>
                          </Link>
                        )}

                        <Link
                          href="/mis-reservas"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span>Mis Reservas</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Cerrar sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile - Avatar + Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {status === "authenticated" && (
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                  <span className="text-xs font-semibold text-white">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                {session.user.role === "admin" && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`h-0.5 w-full bg-current transition-all ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`h-0.5 w-full bg-current transition-all ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`h-0.5 w-full bg-current transition-all ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            {/* User Info en Mobile - Solo si está logueado */}
            {status === "authenticated" && (
              <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {session.user.email}
                </p>
                {session.user.role === "admin" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 mt-2">
                    Administrador
                  </span>
                )}
              </div>
            )}

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Inicio
            </Link>
            <Link
              href="/canchas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Canchas
            </Link>
            <Link
              href="/reservar"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Reservar
            </Link>
            <Link
              href="/mis-reservas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Mis Reservas
            </Link>

            {status === "authenticated" && (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                {session?.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg"
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Cerrar sesión
                </button>
              </>
            )}

            {status === "unauthenticated" && (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-lg text-center"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
