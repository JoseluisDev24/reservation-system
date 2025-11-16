import {
  Clock,
  Shield,
  MessageCircle,
  LayoutDashboard,
  Smartphone,
  Sparkles,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Clock,
      title: "Disponibilidad en tiempo real",
      description:
        "Mirá horarios disponibles al instante sin necesidad de llamar por teléfono.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MessageCircle,
      title: "Confirmación por WhatsApp",
      description:
        "Recibí tu código de reserva y recordatorios directamente en tu WhatsApp.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Shield,
      title: "Reservas seguras",
      description:
        "Sistema de autenticación seguro para proteger tus datos y reservas.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: LayoutDashboard,
      title: "Panel de administración",
      description:
        "Para dueños de canchas: gestiona tus espacios y reservas fácilmente.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Smartphone,
      title: "100% Responsive",
      description:
        "Reservá desde tu celular, tablet o computadora con la misma experiencia.",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Sparkles,
      title: "Interfaz moderna",
      description:
        "Diseño intuitivo y atractivo que hace que reservar sea un placer.",
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            ¿Por qué elegir Reservá5?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La plataforma más completa para reservar canchas deportivas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-white"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
