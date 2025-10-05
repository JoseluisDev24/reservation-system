import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            Reservá<span className="text-3xl">5</span>
          </h3>
          <p className="text-gray-400">
            La forma más fácil de reservar canchas de fútbol en Montevideo.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Enlaces</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/recursos">Canchas</Link>
            </li>
            <li>
              <Link href="/como-funciona">Cómo funciona</Link>
            </li>
            <li>
              <Link href="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contacto</h4>
          <p className="text-gray-400">Email: info@reserva5.com</p>
          <p className="text-gray-400">Tel: +598 99 123 456</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>© 2025 Reservá5. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
