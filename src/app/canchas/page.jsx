import ResourceCard from "@/components/shared/ResourceCard";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";

export const dynamic = "force-dynamic";


async function getCanchas() {
  try {
    await connectDB();
    const canchas = await Resource.find({ available: true }).lean();

    return canchas.map((cancha) => ({
      ...cancha,
      _id: cancha._id.toString(),
    }));
  } catch (error) {
    console.error("Error al cargar canchas:", error);
    return [];
  }
}

export default async function CanchasPage() {
  const canchas = await getCanchas();

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nuestras Canchas</h1>
          <p className="text-xl text-gray-600">
            Elegí la cancha perfecta para tu partido
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {canchas.length} canchas disponibles
          </p>
        </div>

        {canchas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No hay canchas disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {canchas.map((cancha) => (
              <ResourceCard key={cancha._id} resource={cancha} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
