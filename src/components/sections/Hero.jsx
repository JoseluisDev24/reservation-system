"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-screen pt-16 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/hero.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="inline-block mb-4 px-4 py-2 bg-blue-900/80 rounded-full text-sm font-semibold">
          ⚽ Reservá en segundos
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transform transition-all duration-500 hover:scale-105">
          Tu cancha, tu horario,
          <br />
          <span className="text-blue-500">sin complicaciones</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Encontrá y reservá canchas de fútbol 5, 7 y 11 en tu zona.
          Disponibilidad en tiempo real, confirmación instantánea.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-lg px-8 py-6 transform transition hover:scale-105 hover:shadow-2xl bg-blue-950"
            asChild
          >
            <Link href="/recursos">Ver canchas disponibles</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-black transform transition hover:scale-105 hover:shadow-2xl"
            asChild
          >
            <Link href="/como-funciona">¿Cómo funciona?</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-400">
              15+
            </div>
            <div className="text-sm md:text-base text-gray-300">Canchas</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-400">
              500+
            </div>
            <div className="text-sm md:text-base text-gray-300">
              Reservas/mes
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-400">
              4.8★
            </div>
            <div className="text-sm md:text-base text-gray-300">Valoración</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
