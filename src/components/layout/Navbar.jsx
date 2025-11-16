"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  LayoutDashboard,
  Calendar,
  ChevronDown,
  Building2,
  Home,
  List,
} from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target)
      ) {
        setIsAdminDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-black shadow-2xl border-b-2 border-green-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="absolute top-0 left-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-3xl font-[family-name:var(--font-bebas)] tracking-wider text-white group-hover:text-green-400 transition-colors">
              RESERVÁ5
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/canchas"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
            >
              Canchas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/mis-reservas"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
            >
              Mis Reservas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {status === "loading" && (
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-200"></div>
              </div>
            )}

            {status === "unauthenticated" && (
              <div className="flex items-center space-x-6">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-400 transition-all hover:scale-105 shadow-md"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {status === "authenticated" && (
              <div className="flex items-center space-x-4">
                {session?.user?.role === "admin" && (
                  <div className="relative" ref={adminDropdownRef}>
                    <button
                      onClick={() =>
                        setIsAdminDropdownOpen(!isAdminDropdownOpen)
                      }
                      className="flex items-center space-x-1.5 text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          isAdminDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isAdminDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link
                          href="/admin"
                          onClick={() => setIsAdminDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-green-600" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          href="/admin/canchas"
                          onClick={() => setIsAdminDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Building2 className="h-4 w-4 text-green-600" />
                          <span>Gestión de Canchas</span>
                        </Link>

                        <Link
                          href="/admin/reservations"
                          onClick={() => setIsAdminDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span>Gestión de Reservas</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="relative">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name}
                          className="w-8 h-8 rounded-full ring-2 ring-green-500 shadow-md object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center ring-2 ring-green-500 shadow-md">
                          <span className="text-xs font-semibold text-white">
                            {session.user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {session.user.role === "admin" && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-white">
                        {session.user.name}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {session.user.email}
                        </p>
                        {session.user.role === "admin" && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                              Administrador
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          href="/mis-reservas"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span>Mis Reservas</span>
                        </Link>
                      </div>

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

          <div className="md:hidden flex items-center space-x-3">
            {status === "authenticated" && (
              <div className="relative">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full ring-2 ring-green-500 shadow-md object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center ring-2 ring-green-500 shadow-md">
                    <span className="text-xs font-semibold text-white">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {session.user.role === "admin" && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
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

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-1">
            {status === "authenticated" && (
              <div className="px-4 py-3 mb-2 bg-gray-800/80 rounded-lg">
                <p className="text-sm font-medium text-white">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {session.user.email}
                </p>
                {session.user.role === "admin" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white mt-2">
                    Administrador
                  </span>
                )}
              </div>
            )}

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-lg"
            >
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
            <Link
              href="/canchas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-lg"
            >
              <List className="h-4 w-4" />
              <span>Canchas</span>
            </Link>
            <Link
              href="/mis-reservas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-lg"
            >
              <Calendar className="h-4 w-4" />
              <span>Mis Reservas</span>
            </Link>

            {status === "authenticated" && (
              <>
                <div className="border-t border-gray-800 my-2"></div>
                {session?.user?.role === "admin" && (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-green-400 hover:bg-gray-800/50 rounded-lg"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/admin/canchas"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-green-400 hover:bg-gray-800/50 rounded-lg"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>Gestión de Canchas</span>
                    </Link>
                    <Link
                      href="/admin/reservations"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-green-400 hover:bg-gray-800/50 rounded-lg"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Gestión de Reservas</span>
                    </Link>
                  </>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </button>
              </>
            )}

            {status === "unauthenticated" && (
              <>
                <div className="border-t border-gray-800 my-2"></div>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-lg"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm bg-green-500 text-white hover:bg-green-400 rounded-lg text-center"
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
