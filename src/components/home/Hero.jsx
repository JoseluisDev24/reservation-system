"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const scrollToSection = () => {
    const element = document.getElementById("como-funciona");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/hero.webp"
        alt="Cancha de fútbol"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[center_50%] md:object-[center_30%]"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-[1]"></div>

      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto w-full">
        <div className="h-10 mb-5"></div>

        <h1 className="font-[family-name:var(--font-bebas)] tracking-wide text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-5 leading-tight drop-shadow-2xl uppercase">
          Tu cancha, tu horario,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
            sin complicaciones
          </span>
        </h1>

        <div className="mb-8 max-w-3xl mx-auto space-y-2">
          <p className="text-lg md:text-xl text-white font-medium leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Encontrá y reservá canchas de fútbol 5, 7 y 11 en tu zona.
          </p>
          <p className="text-sm md:text-base text-gray-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Disponibilidad en tiempo real, confirmación instantánea.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center px-4 mb-16">
          <Link
            href="/canchas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base md:text-lg px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transform transition-all hover:scale-105 hover:shadow-2xl group shadow-xl"
          >
            Ver canchas disponibles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={scrollToSection}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base md:text-lg px-6 py-3 bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-black rounded-lg font-semibold transform transition-all hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            ¿Cómo funciona?
          </button>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden sm:block cursor-pointer hover:scale-110 transition-transform"
        onClick={scrollToSection}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
