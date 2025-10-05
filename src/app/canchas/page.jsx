import ResourceCard from "@/components/shared/ResourceCard";

const canchas = [
  {
    id: 1,
    name: "Cancha 1 - Césped sintético",
    type: "Fútbol 5",
    capacity: 10,
    pricePerHour: 800,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
    amenities: ["Vestuarios", "Iluminación", "Estacionamiento"],
  },
  {
    id: 2,
    name: "Cancha 2 - Profesional",
    type: "Fútbol 7",
    capacity: 14,
    pricePerHour: 1200,
    image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800",
    amenities: ["Vestuarios", "Iluminación", "Duchas"],
  },
  {
    id: 3,
    name: "Cancha 3 - Techada",
    type: "Fútbol 5",
    capacity: 10,
    pricePerHour: 1000,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    amenities: ["Techada", "Vestuarios", "Iluminación"],
  },
];

export default function RecursosPage() {
  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nuestras Canchas</h1>
          <p className="text-xl text-gray-600">
            Elegí la cancha perfecta para tu partido
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {canchas.map((cancha) => (
            <ResourceCard key={cancha.id} resource={cancha} />
          ))}
        </div>
      </div>
    </main>
  );
}
