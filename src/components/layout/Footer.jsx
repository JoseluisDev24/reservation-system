import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t-2 border-green-500 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + Descripción */}
        <div>
          <h3 className="text-3xl font-[family-name:var(--font-bebas)] tracking-wider mb-4 text-green-400">
            RESERVÁ5
          </h3>
          <p className="text-gray-400">
            La forma más fácil de reservar canchas de fútbol en Montevideo.
          </p>
        </div>

        {/* Enlaces */}
        <div>
          <h4 className="font-semibold mb-4 text-green-400">Enlaces</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link
                href="/canchas"
                className="hover:text-green-400 transition-colors"
              >
                Canchas
              </Link>
            </li>
            <li>
              <Link
                href="/como-funciona"
                className="hover:text-green-400 transition-colors"
              >
                Cómo funciona
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="hover:text-green-400 transition-colors"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-semibold mb-4 text-green-400">Contacto</h4>
          <p className="text-gray-400 hover:text-green-400 transition-colors">
            Email: info@reserva5.com
          </p>
          <p className="text-gray-400 hover:text-green-400 transition-colors">
            Tel: +598 99 123 456
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
        <p>© 2025 Reservá5. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
