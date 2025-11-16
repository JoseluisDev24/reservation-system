import { Building2, Calendar, Users, Trophy } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: Building2,
      value: "7+",
      label: "Canchas disponibles",
      description: "En toda la zona",
    },
    {
      icon: Calendar,
      value: "100+",
      label: "Reservas realizadas",
      description: "Y sumando",
    },
    {
      icon: Users,
      value: "50+",
      label: "Usuarios registrados",
      description: "Confiando en nosotros",
    },
    {
      icon: Trophy,
      value: "24/7",
      label: "Disponibilidad",
      description: "Reservá cuando quieras",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Números que hablan por sí solos
          </h2>
          <p className="text-xl text-gray-400">
            La comunidad deportiva está creciendo
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {stat.value}
              </div>

              <div className="text-lg font-semibold mb-1">{stat.label}</div>

              <div className="text-sm text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
