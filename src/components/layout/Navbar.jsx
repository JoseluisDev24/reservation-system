"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="border-b backdrop-blur bg-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/pelota.png"
            alt="Logo"
            width={50}
            height={50}
          />
          <Link href="/" className="text-3xl font-bold text-green-900 flex items-center">
            Reservá<span className="text-4xl text-black">5</span>
          </Link>
        </div>

        <div className="hidden md:flex gap-6 text-lg font-semibold">
          <Link href="/recursos" className="hover:text-blue-600">
            Canchas
          </Link>
          <Link href="/como-funciona" className="hover:text-blue-600">
            Cómo funciona
          </Link>
        </div>

        {/* Botones - SHADCN */}
        <div className="flex gap-2">
          <Button variant="ghost" asChild className={"text-lg"}>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>

        {/* Mobile menu - SHADCN */}
        <DropdownMenu>
          <DropdownMenuTrigger className="md:hidden">
            <Button variant="ghost" size="icon">
              ☰
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Canchas</DropdownMenuItem>
            <DropdownMenuItem>Cómo funciona</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
