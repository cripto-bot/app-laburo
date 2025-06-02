// app/page.tsx
import Image from 'next/image'; // Componente de Next.js para optimizar imágenes
import Link from 'next/link';   // Componente de Next.js para la navegación entre páginas

export default function HomePage() {
  // La URL de tu logo directamente desde Arweave
  const logoUrl = "https://fv7kf4bgvtn3w5vmggqmhohi3tifk42xlnzevmao5mrnbnzcnvja.arweave.net/LX6i8Cas27t2rDGgw7jo3NBVc1dbckqwDusi0LcibVI";

  return (
    // Clases de Tailwind CSS para estilizar:
    // flex, flex-col: para usar flexbox en columna
    // items-center, justify-center: para centrar el contenido
    // min-h-screen: para que ocupe al menos toda la altura de la pantalla
    // bg-gray-100: color de fondo gris claro
    // text-gray-800: color de texto por defecto
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-100 text-gray-800">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <div className="mb-8">
          {/* Componente Image de Next.js:
              src: la fuente de la imagen (nuestra URL de Arweave)
              alt: texto alternativo para accesibilidad y SEO
              width, height: dimensiones de la imagen (importante para que Next.js reserve espacio)
              priority: indica a Next.js que cargue esta imagen con alta prioridad (bueno para logos en la parte visible)
          */}
          <Image src={logoUrl} alt="Laburo Logo" width={150} height={150} priority />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 mt-2">
          Laburo
        </h1>
        <p className="mt-3 text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl">
          Tu plataforma paraguaya para conectar personas que necesitan trabajos con prestadores disponibles en su zona.
        </p>

        {/* Contenedor para los botones/enlaces de acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center mt-10 w-full max-w-md sm:max-w-xl gap-6">
          {/* Componente Link de Next.js para navegación sin recargar la página completa */}
          <Link
            href="/registro" // La ruta a la que navegará (crearemos esta página después)
            className="block w-full sm:w-auto text-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
          >
            Regístrate
          </Link>

          <Link
            href="/login" // La ruta a la que navegará (crearemos esta página después)
            className="block w-full sm:w-auto text-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg shadow-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-colors duration-150 mt-4 sm:mt-0"
          >
            Ingresar
          </Link>
        </div>
      </main>

      <footer className="w-full text-center p-8 mt-12 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Laburo. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
