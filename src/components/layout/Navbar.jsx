import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b backdrop-blur-md bg-white/95 fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform hover:scale-105"
        >
          <span className="text-2xl sm:text-3xl font-bold text-green-900 transition-colors  group-hover:text-green-700">
            ⚽ Reservá<span className="text-3xl sm:text-4xl text-black">5</span>
          </span>
        </Link>

        <div className="hidden md:flex gap-8 text-base font-semibold">
          <Link
            href="/canchas"
            className="text-gray-700 hover:text-green-700 transition-colors relative group"
          >
            Canchas
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="#como-funciona"
            className="text-gray-700 hover:text-green-700 transition-colors relative group"
          >
            Cómo funciona
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/mis-reservas"
            className="text-gray-700 hover:text-green-700 transition-colors relative group"
          >
            Mis Reservas
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all group-hover:w-full"></span>
          </Link>
        </div>

        <div className="hidden md:flex gap-3">
          <Button
            variant="ghost"
            asChild
            className="text-base font-medium hover:text-green-700 hover:bg-green-50"
          >
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button
            asChild
            className="bg-green-700 hover:bg-green-800 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="hover:bg-green-50">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/recursos" className="cursor-pointer">
                Canchas
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/como-funciona" className="cursor-pointer">
                Cómo funciona
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/login" className="cursor-pointer">
                Iniciar sesión
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/register"
                className="cursor-pointer font-semibold text-green-700"
              >
                Registrarse
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
