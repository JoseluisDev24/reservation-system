import { Search, Calendar, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Buscá tu cancha",
      description:
        "Explorá canchas disponibles en tu zona con fotos y precios.",
    },
    {
      icon: Calendar,
      title: "Elegí fecha y hora",
      description: "Seleccioná el día y horario que mejor te convenga.",
    },
    {
      icon: CheckCircle,
      title: "Confirmá y jugá",
      description: "Recibí tu confirmación al instante y presentate a jugar.",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-gray-700">
            Reservar tu cancha es más fácil que nunca
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-green-300 hover:-translate-y-2"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <step.icon className="w-10 h-10 text-white" />
              </div>

              <div className="text-7xl font-bold text-green-600/20 mb-4">
                {index + 1}
              </div>

              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
