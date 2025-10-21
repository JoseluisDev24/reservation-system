import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen pt-16 flex items-center justify-center overflow-hidden">
      {/* Background Image - Con posición responsive */}
      <div
        className="absolute inset-0 bg-cover bg-[center_50%] md:bg-[center_30%]"
        style={{
          backgroundImage: "url(/hero1.jpg)",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-green-600/90 backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg">
          <span className="animate-bounce">⚽</span>
          Reservá en segundos
        </div>

        <h1 className="font-[family-name:var(--font-bebas)] tracking-wide text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 leading-tight drop-shadow-2xl uppercase">
          Tu cancha, tu horario,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
            sin complicaciones
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl mb-8 text-white max-w-2xl mx-auto leading-relaxed bg-black/50 backdrop-blur-sm py-2 px-4 rounded-2xl border border-white/10">
          Encontrá y reservá canchas de fútbol 5, 7 y 11 en tu zona.
          Disponibilidad en tiempo real, confirmación instantánea.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700 transform transition-all hover:scale-105 hover:shadow-2xl group shadow-xl"
            asChild
          >
            <Link href="/canchas" className="flex items-center gap-2">
              Ver canchas disponibles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-black transform transition-all hover:scale-105 hover:shadow-2xl shadow-lg"
            asChild
          >
            <Link href="/como-funciona">¿Cómo funciona?</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator - FUERA DEL CONTENT CONTAINER */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:flex">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
