import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden">
      <Image
        src="/hero.jpg"
        alt="Fútbol"
        fill
        priority
        className="object-cover"
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90"></div>

      <div className="relative z-10 text-center text-white px-4 py-16 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-green-600/90 backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          <span className="animate-bounce">⚽</span>
          Reservá en segundos
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          Tu cancha, tu horario,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
            sin complicaciones
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-200 bg-black/60 backdrop-blur-xs rounded-xl max-w-3xl mx-auto leading-relaxed">
          Encontrá y reservá canchas de fútbol 5, 7 y 11 en tu zona.
          <br className="hidden sm:block" />
          Disponibilidad en tiempo real, confirmación instantánea.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700 transform transition-all hover:scale-105 hover:shadow-2xl group"
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
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-black transform transition-all hover:scale-105 hover:shadow-2xl"
            asChild
          >
            <Link href="/como-funciona">¿Cómo funciona?</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105 cursor-default">
            <Calendar className="w-8 h-8 text-green-400" />
            <div className="text-2xl md:text-3xl font-bold text-green-400">
              15+
            </div>
            <div className="text-sm md:text-base text-gray-300">
              Canchas disponibles
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105 cursor-default">
            <Clock className="w-8 h-8 text-green-400" />
            <div className="text-2xl md:text-3xl font-bold text-green-400">
              24/7
            </div>
            <div className="text-sm md:text-base text-gray-300">
              Reservas online
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105 cursor-default">
            <MapPin className="w-8 h-8 text-green-400" />
            <div className="text-2xl md:text-3xl font-bold text-green-400">
              3 zonas
            </div>
            <div className="text-sm md:text-base text-gray-300">
              En Montevideo
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:flex">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
